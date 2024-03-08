import { PartialType } from '@nestjs/swagger';

export class InstitutionClarisaDto {
  code: number;
  name: string;
  acronym: string;
  websiteLink: string;
  added: string;
  is_active: number;
  countryOfficeDTO: CountryOfficeDTO[];
  institutionType: InstitutionType;
}

export class CountryOfficeDTO {
  regionDTO: any;
  code: number;
  isHeadquarter: number;
  isoAlpha2: string;
  name: string;
}

export class InstitutionType {
  code: number;
  name: string;
}

export class MapInstitutionClarisaDto extends PartialType(
  InstitutionClarisaDto,
) {
  loc_element_id!: number;
}
