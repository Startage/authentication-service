import { AuthService } from '@/auth/auth.service';
import { KafkaProviderFactory } from '@/common/provider/kafka-provider-factory';
import { PrismaService } from '@/prisma.service';
import { UserConfirmEmailModule } from '@/user-confirm-email/user-confirm-email.module';
import { UserRefreshTokenModule } from '@/user-refresh-token/user-refresh-token.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, UserConfirmEmailModule, UserRefreshTokenModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    KafkaProviderFactory.create({
      provide: 'NOTIFICATION_KAFKA_SERVICE',
      clientId: 'notification',
      groupId: 'notification-consumer',
    }),
  ],
})
export class AuthModule {}
