import { CustomClientKafka } from '@/common/custom-client-kafka';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export class KafkaProviderFactory {
  static create({
    provide,
    clientId,
    groupId,
  }: {
    provide: string;
    clientId: string;
    groupId: string;
  }) {
    return {
      provide,
      useFactory: (configService: ConfigService) => {
        const brokersStr = configService.get('KAFKA_BROKERS');
        let brokers = [];
        if (brokersStr) {
          brokers = brokersStr.split(',').filter((brokerUrl) => !!brokerUrl);
        }
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId,
              brokers: brokers,
            },
            consumer: {
              groupId,
              allowAutoTopicCreation: true,
            },
          },
          customClass: CustomClientKafka,
        } as any);
      },
      inject: [ConfigService],
    };
  }
}
