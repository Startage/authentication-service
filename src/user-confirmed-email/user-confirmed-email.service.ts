import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserConfirmedEmail } from '@prisma/client';
import { PrismaClient } from '@prisma/client/scripts/default-index';

@Injectable()
export class UserConfirmedEmailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    userConfirmedEmail: Omit<
      UserConfirmedEmail,
      'id' | 'updatedAt' | 'createdAt' | 'disabledAt'
    >,
    prisma?: PrismaClient,
  ) {
    return (prisma || this.prismaService).userConfirmedEmail.create({
      data: userConfirmedEmail,
    });
  }

  async loadByUserConfirmEmailId({
    userConfirmEmailId,
  }: {
    userConfirmEmailId: string;
  }) {
    return this.prismaService.userConfirmedEmail.findUnique({
      where: {
        userConfirmEmailId,
      },
    });
  }
}
