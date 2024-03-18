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
  regionDTO: unknown;
  code: number;
  isHeadquarter: number;
  isoAlpha2: string;
  name: string;
  loc_element_id!: number;
}

export class InstitutionType {
  code: number;
  name: string;
}
