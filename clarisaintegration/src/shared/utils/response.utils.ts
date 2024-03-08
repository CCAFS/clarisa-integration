import { ServiceResponseDto } from '../dtos/service-response.dto';

export class ResponseUtils {
  static format<T>(res: ServiceResponseDto<T>): ServiceResponseDto<T> {
    return {
      message: res.message,
      status: res.status,
      data: res?.data,
      errors: res?.errors,
    };
  }
}
