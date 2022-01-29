import { AuthService } from '@/auth/auth.service';
import { KafkaModule } from '@/kafka/kafka.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserConfirmEmailModule } from '@/user-confirm-email/user-confirm-email.module';
import { UserRefreshTokenModule } from '@/user-refresh-token/user-refresh-token.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    UserConfirmEmailModule,
    UserRefreshTokenModule,
    PrismaModule,
    KafkaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
