import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, FindAllOptions } from '@mikro-orm/mysql';
import { Institution } from './entities/institutions.entity';
import { HttpService } from '@nestjs/axios';
import { Clarisa } from '../../tools/connections/clarisa.connection';
import { env } from 'process';
import { InstitutionsMapper } from '../../shared/mappers/institutions.mapper';
import { InstitutionClarisaDto } from '../../shared/dtos/intitution-clarisa.dto';
import { InstitutionsLocations } from './entities/institutions-locations.entity';
import { LocElement } from './entities/loc-elements.entity';
import { ClrisaMessageDto } from '../../shared/dtos/clrisa-message.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClarisaService {
  private clarisa: Clarisa;
  private readonly _logger = new Logger(ClarisaService.name);

  constructor(
    private readonly dataSource: EntityManager,
    private readonly _http: HttpService,
    private readonly configService: ConfigService,
  ) {
    // the Clarisa class is used to connect to the Clarisa API
    this.clarisa = new Clarisa(
      configService.get<string>('CLARISA_HOST'),
      this._http,
      {
        password: configService.get<string>('CLARISA_PASSWORD'),
        username: configService.get<string>('CLARISA_USERNAME'),
      },
    );
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
    await this.clon_institutions(lastUpdated);
    await this.clon_institutionLocations(lastUpdated);
  }

  /**
   *
   * @param entityClass  a class that represents the entity
   * @returns
   * @description This method returns a message object with the following properties: OK, ERROR, START, FINALLY
   * @example ClarisaMessage(Institution) returns { OK: 'The data of Institution was saved correctly', ERROR: 'Error saving data of Institution', START: 'Start saving data of Institution', FINALLY: 'End saving data of Institution' }
   */
  private ClarisaMessage<C>(entityClass: new () => C): ClrisaMessageDto {
    return {
      OK: `The data of ${entityClass.name} was saved correctly`,
      ERROR: `Error saving data of ${entityClass.name}`,
      START: `Start saving data of ${entityClass.name}`,
      FINALLY: `End saving data of ${entityClass.name}`,
      NO_DATA_CREATE: `No data to create in ${entityClass.name}`,
      DATA_PENDING_UPDATE: (count) =>
        `${count} elements pending to update in ${entityClass.name}`,
      DATA_CREATED: (count) =>
        `${count} elements created in ${entityClass.name}`,
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
  private async clon_institutions(lastUpdated: number) {
    const mss = this.ClarisaMessage(Institution);
    await this.getInstitutions(lastUpdated).then(
      async (res: InstitutionClarisaDto[]) => {
        const saveData: Institution[] = [];
        // this loop is used to map the data from Clarisa to the entity
        const inserInstitutions: Institution[] = await this.dataSource
          .getRepository(Institution)
          .findAll({
            where: { id: { $in: res.map((el) => el.code) } },
          });
        // then is used to filter the data to add
        // ir return only the data that does not exist in the database
        const insertOnly = res.filter(
          (i) => !inserInstitutions.some((aii) => aii.id == i.code),
        );
        // if there is no data to add, log a message
        const updateOnly = res.filter((i) =>
          inserInstitutions.some((aii) => aii.id == i.code),
        );
        if (updateOnly.length)
          this._logger.log(mss.DATA_PENDING_UPDATE(updateOnly.length));
        if (!insertOnly.length) {
          // then is used to filter the data to update
          this._logger.log(mss.NO_DATA_CREATE);
          return 0;
        }
        for (const el of insertOnly) {
          // getReference is used to get the reference of the entity
          // the reference is used to avoid creating a new entity if it already exists
          // if the entity does not exist, a new entity is created
          let saveDataObj = this.dataSource.create(
            Institution,
            InstitutionsMapper(this.configService, el),
          ) as Institution;
          // the entity is added to the array of entities to be saved
          saveData.push(saveDataObj);
        }
        await this.saveDataFunction(saveData, mss);
      },
    );
  }

  /**
   *
   * @param entityClass a class that represents the entity
   * @param saveData an array of entities to be saved
   * @returns
   * @description This method saves the data to the database
   */
  private async saveDataFunction<C>(saveData: C[], mss: ClrisaMessageDto) {
    this._logger.log(mss.START);
    this._logger.log(mss.DATA_CREATED(saveData.length));
    await this.dataSource
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
  }

  /**
   *
   * @returns
   * @description This method returns the last updated institution from the database
   * @example findLastUpdatedInstitution() returns Promise<Institution>
   * @example findLastUpdatedInstitution() returns Promise<null>
   */
  private async findLastUpdatedInstitution(): Promise<Institution> {
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

  private async getInstitutions(lastUpdatedTime) {
    return this.clarisa.get(
      `institutions?show=all${lastUpdatedTime ? `&from=${lastUpdatedTime}` : ''}`,
    ) as Promise<InstitutionClarisaDto[]>;
  }

  /*
   *
   * @param entityClass a class that represents the entity
   * @param lastUpdatedTime a number that represents the last updated time
   * @returns
   * @description This method matches the institution location from Clarisa to the database
   */
  async clon_institutionLocations(lastUpdatedTime?: number) {
    const mss = this.ClarisaMessage(InstitutionsLocations);
    // get is used to get the data from the Clarisa API
    const resCInstitutions: InstitutionClarisaDto[] =
      await this.getInstitutions(lastUpdatedTime);

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

    // findall institutions locations from the database
    const res_insti = await this.dataSource
      .getRepository(InstitutionsLocations)
      .findAll({
        where: {
          institution_id: { $in: resCInstitutions.map((el) => el.code) },
        },
      });

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
        this.dataSource.create(InstitutionsLocations, el),
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
    const updateOnly = newDataToSave.filter((i) =>
      res_insti.some(
        (aii) =>
          aii.institution_id == i.institution_id &&
          aii.loc_element_id == i.loc_element_id,
      ),
    );
    if (updateOnly.length)
      this._logger.log(mss.DATA_PENDING_UPDATE(updateOnly.length));
    if (!toAdd.length) {
      // then is used to filter the data to update
      this._logger.log(mss.NO_DATA_CREATE);
      return 0;
    }
    await this.saveDataFunction(toAdd, mss);
  }
}
