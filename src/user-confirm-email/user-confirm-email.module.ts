import { KafkaModule } from '@/kafka/kafka.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserConfirmedEmailModule } from '@/user-confirmed-email/user-confirmed-email.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { UserConfirmEmailService } from './user-confirm-email.service';
import { UserConfirmEmailController } from './user-confirm-email.controller';

@Module({
  providers: [UserConfirmEmailService],
  exports: [UserConfirmEmailService],
  controllers: [UserConfirmEmailController],
  imports: [UserModule, UserConfirmedEmailModule, KafkaModule, PrismaModule],
})
export class UserConfirmEmailModule {}
