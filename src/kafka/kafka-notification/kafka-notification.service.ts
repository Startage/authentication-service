import { CustomClientKafka } from '@/common/custom-client-kafka';
import { Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaNotificationService {
  constructor(
    @Inject('NOTIFICATION_KAFKA_SERVICE') private client: CustomClientKafka,
  ) {}

  emit<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Observable<TResult> {
    return this.client.emit(pattern, data);
  }

  async sendAsync<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Promise<TResult> {
    return await this.client.sendAsync(pattern, data);
  }
}
