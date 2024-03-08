import { InstitutionsLocations } from '../../domain/clarisa/entities/institutions-locations.entity';
import { MapInstitutionClarisaDto } from '../dtos/intitution-clarisa.dto';

export const institutionsLocationMapper = (
  data: MapInstitutionClarisaDto,
): Partial<InstitutionsLocations> => {
  return {
    institution_id: data?.code,
    loc_element_id: data?.loc_element_id,
    is_headquater: data?.countryOfficeDTO?.[0]?.isHeadquarter,
    city: null,
  };
};
