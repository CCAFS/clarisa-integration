import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { ServerResponseDto } from '../dtos/server-response.dto';

@Catch()
export class GlobalExceptions implements ExceptionFilter {
  private readonly _logger: Logger = new Logger('System');
  catch(exception: { [key: string]: string }, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception?.status
      ? HttpStatus[exception.status as keyof typeof HttpStatus]
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.name;
    const error = exception?.message;

    const res: ServerResponseDto<unknown> = {
      message: message,
      status: status,
      errors: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this._logger.error(exception?.stack);

    response.status(status).json(res);
  }
}
