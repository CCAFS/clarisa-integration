import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataSource, In } from 'typeorm';

import { Clarisa } from '../../tools/connections/clarisa.connection';
import { InstitutionsMapper } from '../../shared/mappers/institutions.mapper';
import { InstitutionClarisaDto } from '../../shared/dtos/intitution-clarisa.dto';
import { ClarisaMessageDto } from '../../shared/dtos/clrisa-message.dto';

import { Institution } from './entities/institutions.entity';
import { InstitutionsLocations } from './entities/institutions-locations.entity';
import { LocElement } from './entities/loc-elements.entity';

@Injectable()
export class ClarisaService {
  private clarisa: Clarisa;
  private readonly _logger = new Logger(ClarisaService.name);

  constructor(
    private readonly dataSource: DataSource,
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
   * @example dataReplicationProcess() returns Promise<void>
   */
  async dataReplicationProcess(): Promise<boolean> {
    this._logger.verbose(`Start saving data of ${ClarisaService.name}`);

    const lastInst = await this.findLastUpdatedInstitution();
    const lastUpdated = new Date(lastInst?.updated_at).getTime();
    await this.cloneInstitutions(lastUpdated);
    await this.cloneInstitutionLocations(lastUpdated);
    return Promise.resolve(true);
  }

  /**
   *
   * @param entityClass  a class that represents the entity
   * @returns
   * @description This method returns a message object with the following properties: OK, ERROR, START, FINALLY
   * @example ClarisaMessage(Institution) returns { OK: 'The data of Institution was saved correctly', ERROR: 'Error saving data of Institution', START: 'Start saving data of Institution', FINALLY: 'End saving data of Institution' }
   */
  private ClarisaMessage<C>(entityClass: new () => C): ClarisaMessageDto {
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
  private async cloneInstitutions(lastUpdated: number): Promise<void> {
    const mss = this.ClarisaMessage(Institution);
    await this.getInstitutions(lastUpdated).then(
      async (res: InstitutionClarisaDto[]) => {
        const saveData: Partial<Institution>[] = [];
        // this loop is used to map the data from Clarisa to the entity
        const inserInstitutions: Institution[] = await this.dataSource
          .getRepository(Institution)
          .find({
            where: { id: In(res.map((el) => el.code)) },
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
          return [];
        }
        for (const el of insertOnly) {
          // getReference is used to get the reference of the entity
          // the reference is used to avoid creating a new entity if it already exists
          // if the entity does not exist, a new entity is created
          const saveDataObj = InstitutionsMapper(this.configService, el);
          // the entity is added to the array of entities to be saved
          saveData.push(saveDataObj);
        }
        this.persistData<Partial<Institution>>(Institution, saveData, mss);
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
  private async persistData<C>(
    entity: new () => C,
    saveData: C[],
    mss: ClarisaMessageDto,
  ): Promise<void> {
    this._logger.log(mss.START);
    this._logger.log(mss.DATA_CREATED(saveData.length));
    await this.dataSource
      .getRepository(entity)
      .save(saveData)
      // persistAndFlush is used to save the data to the database
      // it returns a promise that resolves to void
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
        .find({ order: { updated_at: 'DESC' } })
        .then((res) => (res.length > 0 ? res[0] : null))
        .catch((err) => {
          this._logger.error(err);
          return null;
        })
    );
  }

  public async getInstitutions(
    lastUpdatedTime: number,
  ): Promise<InstitutionClarisaDto[]> {
    let query = 'institutions?show=all';
    if (lastUpdatedTime) {
      query += `&from=${lastUpdatedTime}`;
    }
    return this.clarisa.get(query);
  }

  /*
   *
   * @param entityClass a class that represents the entity
   * @param lastUpdatedTime a number that represents the last updated time
   * @returns
   * @description This method matches the institution location from Clarisa to the database
   */
  private async cloneInstitutionLocations(
    lastUpdatedTime?: number,
  ): Promise<void> {
    const mss = this.ClarisaMessage(InstitutionsLocations);
    // get is used to get the data from the Clarisa API
    const resClarisaInstitutions: InstitutionClarisaDto[] =
      await this.getInstitutions(lastUpdatedTime);

    // findall loc elements from the database
    const res_locInsti = await this.dataSource.getRepository(LocElement).find();

    // findall institutions locations from the database
    const res_insti = await this.dataSource
      .getRepository(InstitutionsLocations)
      .find({
        where: {
          institution_id: In(resClarisaInstitutions.map((el) => el.code)),
        },
      });

    // map the data from Clarisa to the entity and set the loc_element_id to the id of the loc element from the database
    const newDataToSave: Partial<InstitutionsLocations>[] = [];
    for (const c_institution of resClarisaInstitutions) {
      for (const countyDTO of c_institution.countryOfficeDTO) {
        // set the loc_element_id to the id of the loc element from the database
        countyDTO.loc_element_id = res_locInsti.find(
          (obj) => obj.iso_alpha_2 === countyDTO.isoAlpha2,
        )?.id;
        // if the loc_element_id is null, add the data to the newDataToSave array
        newDataToSave.push({
          city: null,
          institution_id: c_institution.code,
          is_headquater: countyDTO.isHeadquarter,
          loc_element_id: countyDTO.loc_element_id,
        });
      }
    }

    // filter the data to add
    const toAdd = newDataToSave.filter(
      (aiccra_institution) =>
        !res_insti.some(
          (clarisa_institution) =>
            aiccra_institution.loc_element_id ===
              clarisa_institution.loc_element_id &&
            aiccra_institution.institution_id ===
              clarisa_institution.institution_id,
        ),
    );

    const updateOnly = newDataToSave.filter((clarisa_institutions) =>
      res_insti.some(
        (aiccra_institution) =>
          aiccra_institution.institution_id ==
            clarisa_institutions.institution_id &&
          aiccra_institution.loc_element_id ==
            clarisa_institutions.loc_element_id,
      ),
    );
    if (updateOnly.length)
      this._logger.log(mss.DATA_PENDING_UPDATE(updateOnly.length));
    if (!toAdd.length) {
      // then is used to filter the data to update
      this._logger.log(mss.NO_DATA_CREATE);
      return;
    }
    await this.persistData<Partial<InstitutionsLocations>>(
      InstitutionsLocations,
      toAdd,
      mss,
    );
  }
}
