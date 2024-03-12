import { env } from 'process';
import { Institution } from '../../domain/clarisa/entities/institutions.entity';
import { InstitutionClarisaDto } from '../dtos/intitution-clarisa.dto';
import { ConfigService } from '@nestjs/config';

export const InstitutionsMapper = (
  configService: ConfigService,
  data: InstitutionClarisaDto,
): Partial<Institution> => {
  const userAiccra = parseInt(configService.get<string>('USER_AICCRA'));
  return {
    id: data?.code,
    name: data?.name,
    acronym: data?.acronym,
    website_link: data?.websiteLink,
    added: new Date(data?.added),
    created_at: new Date(),
    institution_type_id: data?.institutionType?.code,
    created_by: userAiccra,
    updated_at: new Date(),
    updated_by: userAiccra,
    is_active: true,
  };
};
