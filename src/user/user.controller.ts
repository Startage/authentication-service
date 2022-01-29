import { UserService } from '@/user/user.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern('auth.load-user-by-email')
  async loadByEmail(
    @Payload('value') { email }: { email: string },
  ): Promise<User> {
    return await this.userService.loadByEmail({
      email,
    });
  }

  @MessagePattern('auth.load-user-by-id')
  async loadById(
    @Payload('value') { userId }: { userId: string },
  ): Promise<User> {
    return await this.userService.loadById({
      userId,
    });
  }

  @MessagePattern('auth.update-user-by-id')
  async updateUserById(
    @Payload('value')
    {
      phone,
      name,
      avatarUrl,
      userId,
    }: {
      phone: string;
      name: string;
      avatarUrl: string;
      userId: string;
    },
  ): Promise<Omit<User, 'password'>> {
    return await this.userService.updateById({
      phone,
      name,
      avatarUrl,
      userId,
    });
  }

  @MessagePattern('auth.change-user-password-by-id')
  async updatePasswordById(
    @Payload('value')
    {
      password,
      currentPassword,
      userId,
    }: {
      password: string;
      currentPassword: string;
      userId: string;
    },
  ): Promise<void> {
    await this.userService.validUpdatePasswordById({
      password,
      currentPassword,
      userId,
    });
  }
}
