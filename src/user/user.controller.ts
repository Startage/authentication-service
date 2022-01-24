import { UserService } from '@/user/user.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern('auth.load-user-by-email')
  async verifyEmailExists(
    @Payload('value') { email }: { email: string },
  ): Promise<User> {
    return await this.userService.loadByEmail({
      email,
    });
  }
}
