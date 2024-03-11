import { env } from 'process';
import { Institution } from '../../domain/clarisa/entities/institutions.entity';
import { InstitutionClarisaDto } from '../dtos/intitution-clarisa.dto';

export const InstitutionsMapper = (
  data: InstitutionClarisaDto,
): Partial<Institution> => {
  return {
    id: data?.code,
    name: data?.name,
    acronym: data?.acronym,
    website_link: data?.websiteLink,
    added: new Date(data?.added),
    created_at: new Date(),
    institution_type_id: data?.institutionType?.code,
    created_by: parseInt(`${env.USER_AICCRA}`),
    updated_at: new Date(),
    updated_by: parseInt(`${env.USER_AICCRA}`),
  };
};
