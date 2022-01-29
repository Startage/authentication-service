import { PrismaService } from '@/prisma/prisma.service';
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

  async loadById({ userId }: { userId: string }): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
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

  async validUpdatePasswordById({
    password,
    userId,
    currentPassword,
  }: {
    password: string;
    currentPassword: string;
    userId: string;
  }) {
    const { password: hashedPassword } = await this.loadById({ userId });
    const isValidCurrentPassword = await this.isValidPassword({
      currentPassword,
      hashedPassword,
    });
    if (!isValidCurrentPassword) throw new Error('Current password is invalid');
    await this.updatePasswordById({
      password,
      userId,
    });
  }

  async updateById({
    phone,
    name,
    avatarUrl,
    userId,
  }: {
    phone: string;
    name: string;
    avatarUrl: string;
    userId: string;
  }): Promise<Omit<User, 'password'>> {
    const { password, ...user } = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phone,
        avatarUrl,
      },
    });
    return user;
  }
}
