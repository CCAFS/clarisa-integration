import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

/**
 * This class is a connection to the Clarisa API
 * @class
 * @example
 * const clarisa = new Clarisa(http, { username: 'username', password: 'password' });
 */
export class Clarisa {
  private clarisaHost: string;
  private auth: ClarisaAuthorization;
  private http: HttpService;

  // This method clones data from Clarisa to the database using the Clarisa API
  constructor(host: string, http: HttpService, config: ClarisaOptions) {
    this.clarisaHost = host + 'api/';
    this.auth = {
      auth: {
        password: config.password,
        username: config.username,
      },
    };
    this.http = http;
  }

  /**
   *
   * @param path a string that represents the path to the Clarisa API
   * @returns
   * @description This method gets data from Clarisa using the Clarisa API
   */
  public get<T>(path: string): Promise<T[]> {
    return firstValueFrom(
      // This method gets data from Clarisa using the Clarisa API
      this.http.get<T[]>(this.clarisaHost + path, this.auth).pipe(
        map(({ data }) => {
          return data;
        }),
      ),
    ).catch((err) => {
      throw new BadRequestException(err);
    });
  }
}

interface ClarisaAuthorization {
  auth: ClarisaOptions;
}

interface ClarisaOptions {
  username: string;
  password: string;
}
