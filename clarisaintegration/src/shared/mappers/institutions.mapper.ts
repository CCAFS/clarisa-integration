import { env } from 'process';
import { Institution } from '../../domain/clarisa/entities/institutions.entity';
import { InstitutionClarisaDto } from '../dtos/intitution-clarisa.dto';

export const InstitutionsMapper = (
  data: InstitutionClarisaDto,
  refData: Institution,
): Institution => {
  refData.id = data?.code;
  refData.name = data?.name;
  refData.acronym = data?.acronym;
  refData.website_link = data?.websiteLink;
  refData.added = new Date(data?.added);
  refData.created_at = new Date();
  refData.institution_type_id = data?.institutionType?.code;
  refData.created_by = parseInt(`${env.USER_AICCRA}`);
  return refData;
};
