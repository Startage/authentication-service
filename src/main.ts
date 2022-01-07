import 'module-alias/register';
import { RpcExceptionFilter } from '@/common/filters/rpc-exception.filter';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const brokersStr = process.env.KAFKA_BROKERS;
  let brokers = [];
  if (brokersStr) {
    brokers = brokersStr.split(',').filter((brokerUrl) => !!brokerUrl);
  }
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'auth',
          brokers: brokers,
        },
        consumer: {
          groupId: 'auth-consumer',
          allowAutoTopicCreation: true,
        },
      },
    },
  );
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
}
bootstrap();
