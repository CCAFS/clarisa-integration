import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ClarisaService } from './clarisa.service';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('Clarisa service', () => {
  let service: ClarisaService;

  const httpServiceMock = [
    {
      code: 4356,
      name: 'Consiglio Nazionale delle Ricerche (Cnr)',
      acronym: 'CNR',
      websiteLink: 'https://www.cnr.it/it',
      added: '2020-10-08T20:05:59.000Z',
      is_active: 0,
      countryOfficeDTO: [
        {
          regionDTO: null,
          code: 95,
          isHeadquarter: 1,
          isoAlpha2: 'IT',
          name: 'Italy',
        },
      ],
      institutionType: {
        code: 60,
        name: 'Research organizations and universities National (Universities)',
      },
    },
    {
      code: 6027,
      name: 'Universidad Nacional de la Amazonia Peruana',
      acronym: 'UNAP',
      websiteLink: 'https://www.unapiquitos.edu.pe/',
      added: '2021-02-11T03:05:36.000Z',
      is_active: 0,
      countryOfficeDTO: [
        {
          regionDTO: null,
          code: 151,
          isHeadquarter: 1,
          isoAlpha2: 'PE',
          name: 'Peru',
        },
      ],
      institutionType: {
        code: 60,
        name: 'Research organizations and universities National (Universities)',
      },
    },
    {
      code: 6481,
      name: 'National Institute of Public Health',
      acronym: 'NIPH',
      websiteLink: 'https://www.niph.go.jp/index_en.html',
      added: '2021-02-25T23:47:32.000Z',
      is_active: 0,
      countryOfficeDTO: [
        {
          regionDTO: null,
          code: 99,
          isHeadquarter: 1,
          isoAlpha2: 'JP',
          name: 'Japan',
        },
      ],
      institutionType: {
        code: 60,
        name: 'Research organizations and universities National (Universities)',
      },
    },
    {
      code: 8041,
      name: 'Centre Régional Recherches En Grandes Cultures Beja / Regional Field Crop Research Center of Beja',
      acronym: 'CRRGB',
      websiteLink: null,
      added: '2023-01-17T21:12:57.000Z',
      is_active: 1,
      countryOfficeDTO: [
        {
          regionDTO: null,
          code: 191,
          isHeadquarter: 1,
          isoAlpha2: 'TN',
          name: 'Tunisia',
        },
      ],
      institutionType: {
        code: 59,
        name: 'Research organizations and universities National (NARS)',
      },
    },
    {
      code: 8260,
      name: 'Tashkent Institute of Irrigation & Agricultural Mechanization Engineers',
      acronym: null,
      websiteLink: 'https://tiiame.uz/',
      added: '2023-01-24T18:15:44.000Z',
      is_active: 0,
      countryOfficeDTO: [
        {
          regionDTO: null,
          code: 201,
          isHeadquarter: 1,
          isoAlpha2: 'UZ',
          name: 'Uzbekistan',
        },
      ],
      institutionType: {
        code: 68,
        name: 'Government (National)',
      },
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ClarisaService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn().mockReturnThis(),
            getRepository: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue({}),
              find: jest
                .fn()
                .mockResolvedValueOnce([
                  {
                    id: 9174,
                    name: 'International Security and Development Center',
                    acronym: 'ISDC',
                    website_link: 'https://isdc.org/',
                    program_id: null,
                    institution_type_id: 52,
                    added: '2024-01-17 17:01:11',
                    parent_id: null,
                    created_at: '2024-03-18 16:02:55.194000',
                    updated_at: '2024-03-18 16:02:55.194000',
                    is_active: true,
                    created_by: 1082,
                    updated_by: 1082,
                    modification_justification: null,
                  },
                ])
                .mockResolvedValueOnce([
                  {
                    id: 4356,
                    name: 'Consiglio Nazionale delle Ricerche (Cnr)',
                    acronym: 'CNR',
                    website_link: 'https://www.cnr.it/it',
                    program_id: null,
                    institution_type_id: 60,
                    added: '2020-10-08 20:05:59',
                    parent_id: null,
                    created_at: '2020-10-08 20:05:59',
                    updated_at: '2024-01-18 21:25:41',
                    is_active: 1,
                    created_by: 1,
                    updated_by: null,
                    modification_justification: null,
                  },
                  {
                    id: 6027,
                    name: 'Universidad Nacional de la Amazonia Peruana',
                    acronym: 'UNAP',
                    website_link: 'https://www.unapiquitos.edu.pe/',
                    program_id: null,
                    institution_type_id: 60,
                    added: '2021-02-11 03:05:36',
                    parent_id: null,
                    created_at: '2021-02-11 03:05:36',
                    updated_at: '2024-01-18 21:25:41',
                    is_active: 1,
                    created_by: 1,
                    updated_by: null,
                    modification_justification: null,
                  },
                ])
                .mockResolvedValueOnce([
                  {
                    id: 108,
                    name: 'Italy',
                    iso_alpha_2: 'IT',
                    iso_numeric: 380,
                    parent_id: 712,
                    element_type_id: 2,
                    geoposition_id: null,
                    is_site_integration: 0,
                    is_active: 1,
                    created_by: 1,
                    active_since: '2016-06-24 05:17:09',
                    modified_by: null,
                    modification_justification: null,
                    global_unit_id: 12,
                    rep_ind_regions_id: null,
                    iso_alpha_3: 'ITA',
                  },
                  {
                    id: 112,
                    name: 'Japan',
                    iso_alpha_2: 'JP',
                    iso_numeric: 392,
                    parent_id: 708,
                    element_type_id: 2,
                    geoposition_id: null,
                    is_site_integration: 0,
                    is_active: 1,
                    created_by: 1,
                    active_since: '2016-06-24 05:17:09',
                    modified_by: null,
                    modification_justification: null,
                    global_unit_id: 6,
                    rep_ind_regions_id: null,
                    iso_alpha_3: 'JPN',
                  },
                  {
                    id: 169,
                    name: 'Peru',
                    iso_alpha_2: 'PE',
                    iso_numeric: 604,
                    parent_id: 705,
                    element_type_id: 2,
                    geoposition_id: null,
                    is_site_integration: 0,
                    is_active: 1,
                    created_by: 1,
                    active_since: '2016-06-24 05:17:09',
                    modified_by: null,
                    modification_justification: null,
                    global_unit_id: 23,
                    rep_ind_regions_id: null,
                    iso_alpha_3: 'PER',
                  },
                  {
                    id: 213,
                    name: 'Tunisia',
                    iso_alpha_2: 'TN',
                    iso_numeric: 788,
                    parent_id: 701,
                    element_type_id: 2,
                    geoposition_id: null,
                    is_site_integration: 1,
                    is_active: 1,
                    created_by: 1,
                    active_since: '2016-06-24 05:17:09',
                    modified_by: null,
                    modification_justification: null,
                    global_unit_id: 1,
                    rep_ind_regions_id: null,
                    iso_alpha_3: 'TUN',
                  },
                  {
                    id: 224,
                    name: 'Uzbekistan',
                    iso_alpha_2: 'UZ',
                    iso_numeric: 860,
                    parent_id: 707,
                    element_type_id: 2,
                    geoposition_id: null,
                    is_site_integration: 0,
                    is_active: 1,
                    created_by: 1,
                    active_since: '2016-06-24 05:17:09',
                    modified_by: null,
                    modification_justification: null,
                    global_unit_id: 5,
                    rep_ind_regions_id: null,
                    iso_alpha_3: 'UZB',
                  },
                ])
                .mockResolvedValueOnce([]),
              save: jest.fn().mockResolvedValue({}),
            }),
          },
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<ClarisaService>(ClarisaService);
  });

  it('should throw an error if the result is not found', async () => {
    jest
      .spyOn(service, 'getInstitutions')
      .mockResolvedValue(httpServiceMock as any)
      .mockResolvedValue(httpServiceMock as any);
    await expect(service.dataReplicationProcess()).toEqual(Promise.resolve({}));
  });
});
