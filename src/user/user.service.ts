import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client/scripts/default-index';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  SALT: number;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.SALT = parseInt(this.configService.get('ENCRYPT_SALT', '12'));
  }

  async create(
    {
      password,
      ...data
    }: Omit<User, 'id' | 'updatedAt' | 'createdAt' | 'disabledAt'>,
    prismaClient?: PrismaClient,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, this.SALT);
    return (prismaClient || this.prismaService).user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async loadByEmail({ email }: { email: string }): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateIsConfirmedEmailById(
    {
      isConfirmedEmail,
      userId,
    }: {
      isConfirmedEmail: boolean;
      userId: string;
    },
    prisma?: PrismaClient,
  ) {
    return (prisma || this.prismaService).user.update({
      where: {
        id: userId,
      },
      data: {
        isConfirmedEmail,
      },
    });
  }

  async updatePasswordById(
    {
      password,
      userId,
    }: {
      password: string;
      userId: string;
    },
    prisma?: PrismaClient,
  ) {
    const hashedPassword = await bcrypt.hash(password, this.SALT);
    await (prisma || this.prismaService).user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async isValidPassword({
    currentPassword,
    hashedPassword,
  }: {
    currentPassword: string;
    hashedPassword: string;
  }): Promise<boolean> {
    return bcrypt.compare(currentPassword, hashedPassword);
  }
}
