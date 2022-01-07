import {
  ArgumentsHost,
  Catch,
  Logger,
} from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';

@Catch()
export class RpcExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error(exception);
    return {
      hasError: true,
      error: JSON.stringify(exception),
    };
  }
}
