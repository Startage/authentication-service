import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { PrismaService } from '@/prisma.service';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { UserResetPasswordService } from './user-reset-password.service';
import { UserResetPasswordController } from './user-reset-password.controller';

@Module({
  providers: [
    UserResetPasswordService,
    PrismaService,
    KafkaProviderFactory.create({
      provide: 'NOTIFICATION_KAFKA_SERVICE',
      clientId: 'notification',
      groupId: 'notification-consumer',
    }),
    UserModule,
  ],
  controllers: [UserResetPasswordController],
  imports: [UserModule],
})
export class UserResetPasswordModule {}
