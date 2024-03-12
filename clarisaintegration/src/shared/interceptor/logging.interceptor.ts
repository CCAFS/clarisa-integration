import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Request } from 'express';
import { env } from 'process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  private readonly _logger: Logger = new Logger('System');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const ip = request.socket.remoteAddress;

    return next
      .handle()
      .pipe(
        finalize(
          () =>
            parseInt(this.configService.get<string>('SEE_ALL_LOGS')) &&
            this._logger.log(`[${request.method}]: ${request.url} - By ${ip}`),
        ),
      );
  }
}
