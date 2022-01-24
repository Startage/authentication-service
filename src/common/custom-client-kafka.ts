import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export class CustomClientKafka extends ClientKafka {
  async sendAsync<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Promise<TResult> {
    const result = await firstValueFrom(super.send(pattern, data));
    if (result.hasError) throw new Error(result.error);
    return result;
  }
}
