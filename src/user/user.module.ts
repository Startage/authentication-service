import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  controllers: [],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserModule {}
