import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { PrismaService } from '@/prisma.service';
import { UserConfirmedEmailModule } from '@/user-confirmed-email/user-confirmed-email.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { UserConfirmEmailService } from './user-confirm-email.service';
import { UserConfirmEmailController } from './user-confirm-email.controller';

@Module({
  providers: [
    PrismaService,
    UserConfirmEmailService,
    KafkaProviderFactory.create({
      provide: 'NOTIFICATION_KAFKA_SERVICE',
      clientId: 'notification',
      groupId: 'notification-consumer',
    }),
  ],
  exports: [UserConfirmEmailService],
  controllers: [UserConfirmEmailController],
  imports: [UserModule, UserConfirmedEmailModule],
})
export class UserConfirmEmailModule {}
