import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, FindAllOptions } from '@mikro-orm/mysql';
import { Institution } from './entities/institutions.entity';
import { HttpService } from '@nestjs/axios';
import { Clarisa } from './clarisa.connection';
import { env } from 'process';
import { InstitutionsMapper } from '../../shared/mappers/institutions.mapper';
import { InstitutionClarisaDto } from '../../shared/dtos/intitution-clarisa.dto';
import { InstitutionsLocations } from './entities/institutions-locations.entity';
import { LocElement } from './entities/loc-elements.entity';

@Injectable()
export class ClarisaService {
  private clarisa: Clarisa;
  private readonly _logger = new Logger(ClarisaService.name);

  constructor(
    private readonly dataSource: EntityManager,
    private readonly _http: HttpService,
  ) {
    // the Clarisa class is used to connect to the Clarisa API
    this.clarisa = new Clarisa(this._http, {
      password: env.CLARISA_PASSWORD,
      username: env.CLARISA_USERNAME,
    });
  }

  /**
   *
   * @param entityClass  a class that represents the entity
   * @returns
   * @description This method returns a message object with the following properties: OK, ERROR, START, FINALLY
   * @example ClarisaMessage(Institution) returns { OK: 'The data of Institution was saved correctly', ERROR: 'Error saving data of Institution', START: 'Start saving data of Institution', FINALLY: 'End saving data of Institution' }
   */
  private ClarisaMessage<C>(entityClass: new () => C) {
    return {
      OK: `The data of ${entityClass.name} was saved correctly`,
      ERROR: `Error saving data of ${entityClass.name}`,
      START: `Start saving data of ${entityClass.name}`,
      FINALLY: `End saving data of ${entityClass.name}`,
    };
  }

  /**
   *
   * @param path a string that represents the path to the Clarisa API
   * @param entityClass a class that represents the entity
   * @param mapper a function that maps the data from Clarisa to the entity
   * @returns
   * @description This method clones data from Clarisa to the database using the Clarisa API
   */
  private async cloneData<C>(
    path: string,
    entityClass: new () => C,
    mapper: (data: any, refData: C) => C,
  ) {
    const mss = this.ClarisaMessage(entityClass);
    this._logger.log(mss.START);
    this.clarisa.get(path).then((res) => {
      const saveData: C[] = [];
      // this loop is used to map the data from Clarisa to the entity
      for (const el of res as InstitutionClarisaDto[]) {
        // getReference is used to get the reference of the entity
        // the reference is used to avoid creating a new entity if it already exists
        // if the entity does not exist, a new entity is created
        let refData = this.dataSource.getReference(entityClass, el.code) as C;
        // the mapper function is used to map the data from Clarisa to the entity
        refData = mapper(el, refData);
        // the entity is added to the array of entities to be saved
        saveData.push(refData);
      }

      this.dataSource
        // persistAndFlush is used to save the data to the database
        // it returns a promise that resolves to void
        .persistAndFlush(saveData)
        .then(() => {
          this._logger.log(mss.OK);
        })
        .catch((err) => {
          this._logger.error(mss.ERROR);
          this._logger.error(err);
        })
        .finally(() => {
          this._logger.log(mss.FINALLY);
        });
    });
  }

  /**
   *
   * @returns
   * @description This method returns the last updated institution from the database
   * @example findLastUpdatedInstitution() returns Promise<Institution>
   * @example findLastUpdatedInstitution() returns Promise<null>
   */
  async findLastUpdatedInstitution(): Promise<Institution> {
    return (
      this.dataSource
        .getRepository(Institution)
        // find is used to find the last updated institution from the database using the updated_at field
        // orderBy is used to order the results by the updated_at field in descending order
        // limit is used to limit the results to 1
        .find({}, { orderBy: { updated_at: 'DESC' }, limit: 1 })
        .then((res) => (res.length ? res[0] : null))
        .catch((err) => {
          this._logger.error(err);
          return null;
        })
    );
  }

  /**
   *
   * @param entityClass a class that represents the entity
   * @param lastUpdatedTime a number that represents the last updated time
   * @param updateAll a boolean that represents whether to update all the data
   * @returns
   * @description This method matches the institution location from Clarisa to the database
   */
  async matchInstitutionLocation(
    entityClass: new () => InstitutionsLocations,
    lastUpdatedTime?: number,
    updateAll: boolean = false,
  ) {
    // get is used to get the data from the Clarisa API
    const resCInstitutions: InstitutionClarisaDto[] = await this.clarisa.get(
      `institutions?show=all${lastUpdatedTime && !updateAll ? `&from=${lastUpdatedTime}` : ''}`,
    );

    // findall loc elements from the database
    const res_locInsti = await this.dataSource
      .getRepository(LocElement)
      .findAll();

    // set the whereConfig object to an empty object
    const whereConfig: FindAllOptions<
      InstitutionsLocations,
      never,
      '*',
      never
    > = {};

    // if updateAll is true, set the institution_ids to the code of the institutions from Clarisa
    if (updateAll) {
      const institution_ids = resCInstitutions.map((el) => el.code);
      whereConfig.where = { institution_id: { $in: institution_ids } };
    }

    // findall institutions locations from the database
    const res_insti = await this.dataSource
      .getRepository(InstitutionsLocations)
      .findAll(whereConfig);

    // map the data from Clarisa to the entity and set the loc_element_id to the id of the loc element from the database
    const newDataToSave: Partial<InstitutionsLocations>[] = [];
    for (const el of resCInstitutions) {
      for (const c of el.countryOfficeDTO) {
        // set the loc_element_id to the id of the loc element from the database
        c.loc_element_id = res_locInsti.find(
          (obj) => obj.iso_alpha_2 === c.isoAlpha2,
        )?.id;
        // if the loc_element_id is null, add the data to the newDataToSave array
        newDataToSave.push({
          city: null,
          institution_id: el.code,
          is_headquater: c.isHeadquarter,
          loc_element_id: c.loc_element_id,
        });
      }
    }

    // filter the data to add
    let toAdd = newDataToSave
      .filter(
        (obj1) =>
          !res_insti.some(
            (obj2) =>
              obj1.loc_element_id === obj2.loc_element_id &&
              obj1.institution_id === obj2.institution_id,
          ),
      )
      .map((el) =>
        this.dataSource.create(entityClass, el),
      ) as InstitutionsLocations[];

    // filter the data to remove
    let toRemove = res_insti.filter(
      (obj2) =>
        !newDataToSave.some(
          (obj1) =>
            obj1.loc_element_id === obj2.loc_element_id &&
            obj1.institution_id === obj2.institution_id,
        ),
    );
    const mss = this.ClarisaMessage(entityClass);
    this.dataSource
      .persistAndFlush(toAdd)
      .then(() => {
        this._logger.log(mss.OK);
      })
      .catch((err) => {
        this._logger.error(mss.ERROR);
        this._logger.error(err);
      })
      .finally(() => {
        this._logger.log(mss.FINALLY);
      });
  }

  /**
   *
   * @returns
   * @description This method clones the data of the institutions from Clarisa to the database
   * @example bootstrap() returns Promise<void>
   */
  async bootstrap() {
    this._logger.verbose(`Start saving data of ${ClarisaService.name}`);

    const lastInst = await this.findLastUpdatedInstitution();
    const lastUpdated = lastInst?.updated_at?.getTime();
    this.cloneData(
      `institutions?show=all${lastUpdated ? `&from=${lastUpdated}` : ''}`,
      Institution,
      InstitutionsMapper,
    );
    this.matchInstitutionLocation(InstitutionsLocations, lastUpdated);
  }
}
