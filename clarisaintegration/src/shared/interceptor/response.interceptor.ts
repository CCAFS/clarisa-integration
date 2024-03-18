import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { ServerResponseDto } from '../dtos/server-response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  private readonly _logger: Logger = new Logger('System');
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ServerResponseDto<unknown>> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const ip = request.socket.remoteAddress;

    return next.handle().pipe(
      map((res: { [key: string]: string }) => {
        let modifiedData: ServerResponseDto<unknown> = {
          data: [],
          status: HttpStatus.OK,
          message: 'Unknown message',
          errors: null,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        if (this.isServiceResponseDto(res)) {
          modifiedData = {
            ...modifiedData,
            ...res,
          };
        } else if (this.isError(res)) {
          modifiedData = {
            ...modifiedData,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: res.name,
            errors: res.message,
          };
        }
        const message = `[${request.method}]: ${request.url} status: ${modifiedData.status} - By ${ip}`;

        this.logBasedOnStatus(modifiedData.status, message, res?.stack);

        response.status(modifiedData.status);
        return modifiedData;
      }),
    );
  }

  private logBasedOnStatus(
    status: HttpStatus,
    message: string,
    error?: unknown,
  ): void {
    if (
      status >= HttpStatus.AMBIGUOUS &&
      status < HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      this._logger.warn(message);
      this._logger.warn(error);
    } else if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this._logger.error(message);
      this._logger.error(error);
    } else if (
      !parseInt(this.configService.get<string>('IS_PRODUCTION')) &&
      parseInt(this.configService.get<string>('SEE_ALL_LOGS')) &&
      status >= HttpStatus.OK &&
      status < HttpStatus.AMBIGUOUS
    ) {
      this._logger.verbose(message);
    }
  }

  private isServiceResponseDto(arg: { [key: string]: unknown }): boolean {
    return arg?.status !== undefined && arg?.message !== undefined;
  }

  private isError(arg: { [key: string]: unknown }): boolean {
    return (
      arg?.name !== undefined &&
      arg?.message !== undefined &&
      arg?.stack !== undefined
    );
  }
}
