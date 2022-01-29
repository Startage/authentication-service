import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserRefreshTokenService } from './user-refresh-token.service';
import { UserRefreshTokenController } from './user-refresh-token.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserRefreshTokenService],
  exports: [UserRefreshTokenService],
  controllers: [UserRefreshTokenController],
})
export class UserRefreshTokenModule {}
