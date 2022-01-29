import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRefreshToken } from '@prisma/client';
import { add, fromUnixTime, getUnixTime, isAfter } from 'date-fns';

@Injectable()
export class UserRefreshTokenService {
  EXPIRED_REFRESH_TOKEN: number;
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.EXPIRED_REFRESH_TOKEN = parseInt(
      configService.get('EXPIRED_REFRESH_TOKEN'),
    );
  }

  async create({
    userId,
    createdAt,
  }: Omit<UserRefreshToken, 'id' | 'expiresIn' | 'updatedAt' | 'disabledAt'>) {
    const expiresIn = getUnixTime(
      add(new Date(), {
        days: this.EXPIRED_REFRESH_TOKEN,
      }),
    );
    return this.prisma.userRefreshToken.create({
      data: {
        userId,
        createdAt,
        expiresIn: expiresIn,
      },
    });
  }

  async loadValid({ refreshTokenId }: { refreshTokenId: string }) {
    const findRefreshToken = await this.prisma.userRefreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
      include: {
        user: true,
      },
    });
    if (!findRefreshToken) return null;
    const {
      expiresIn,
      user: { password, ...user },
      ...refreshToken
    } = findRefreshToken;
    if (isAfter(new Date(), fromUnixTime(expiresIn))) return null;
    return {
      ...refreshToken,
      expiresIn,
      user,
    };
  }
}
