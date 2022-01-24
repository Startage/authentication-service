import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { UserRefreshTokenService } from './user-refresh-token.service';
import { UserRefreshTokenController } from './user-refresh-token.controller';

@Module({
  providers: [UserRefreshTokenService, PrismaService],
  exports: [UserRefreshTokenService],
  controllers: [UserRefreshTokenController],
})
export class UserRefreshTokenModule {}
