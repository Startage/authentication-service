import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { UserConfirmedEmailService } from './user-confirmed-email.service';

@Module({
  providers: [UserConfirmedEmailService, PrismaService],
  exports: [UserConfirmedEmailService],
})
export class UserConfirmedEmailModule {}
