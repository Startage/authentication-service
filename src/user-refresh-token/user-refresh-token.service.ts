import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRefreshToken } from '@prisma/client';
import { add, getUnixTime, isAfter } from 'date-fns';

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
    console.log(this.EXPIRED_REFRESH_TOKEN);
    const expiresIn = getUnixTime(
      add(new Date(), {
        seconds: this.EXPIRED_REFRESH_TOKEN,
      }),
    );
    const refreshToken = await this.prisma.userRefreshToken.create({
      data: {
        userId,
        createdAt,
        expiresIn: expiresIn,
      },
    });
    return {
      ...refreshToken,
      expiresIn: parseInt(expiresIn.toString()),
    };
  }

  async loadValid({ refreshTokenId }: { refreshTokenId: string }) {
    const findRefreshToken = await this.prisma.userRefreshToken.findUnique({
      where: {
        id: refreshTokenId,
      },
    });
    if (!findRefreshToken) return null;
    const { expiresIn, ...refreshToken } = findRefreshToken;
    console.log(new Date(expiresIn.toString()));
    if (isAfter(new Date(), new Date(expiresIn.toString()))) return null;
    return {
      ...refreshToken,
      expiresIn: parseInt(expiresIn.toString()),
    };
  }
}
