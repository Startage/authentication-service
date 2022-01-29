import { KafkaModule } from '@/kafka/kafka.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { UserResetPasswordService } from './user-reset-password.service';
import { UserResetPasswordController } from './user-reset-password.controller';

@Module({
  providers: [UserResetPasswordService, UserModule],
  controllers: [UserResetPasswordController],
  imports: [UserModule, PrismaModule, KafkaModule],
})
export class UserResetPasswordModule {}
