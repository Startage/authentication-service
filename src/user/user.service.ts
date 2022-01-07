import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Omit<User, 'id' | 'updatedAt' | 'createdAt'>,
  ): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async loadByEmail({ email }: { email: string }): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
