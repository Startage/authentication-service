import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserConfirmEmailModule } from './user-confirm-email/user-confirm-email.module';
import { UserConfirmedEmailModule } from './user-confirmed-email/user-confirmed-email.module';
import { UserRefreshTokenModule } from './user-refresh-token/user-refresh-token.module';
import { UserResetPasswordModule } from './user-reset-password/user-reset-password.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    UserModule,
    AuthModule,
    UserConfirmEmailModule,
    UserConfirmedEmailModule,
    UserRefreshTokenModule,
    UserResetPasswordModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
