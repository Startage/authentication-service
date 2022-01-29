import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { KafkaNotificationService } from '@/kafka/kafka-notification/kafka-notification.service';
import { Module } from '@nestjs/common';

const notificationProvider = KafkaProviderFactory.create({
  provide: 'NOTIFICATION_KAFKA_SERVICE',
  clientId: 'notification',
  groupId: 'notification-consumer',
});

@Module({
  providers: [notificationProvider, KafkaNotificationService],
  exports: [KafkaNotificationService],
})
export class KafkaModule {}
