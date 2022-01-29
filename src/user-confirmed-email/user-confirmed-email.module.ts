import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserConfirmedEmailService } from './user-confirmed-email.service';

@Module({
  imports: [PrismaModule],
  providers: [UserConfirmedEmailService],
  exports: [UserConfirmedEmailService],
})
export class UserConfirmedEmailModule {}
