import { AuthService } from '@/auth/auth.service';
import { UserService } from '@/user/user.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern('auth.login')
  async login(
    @Payload('value') data: { username: string; password: string },
  ): Promise<any> {
    this.logger.log(`Login user: ${JSON.stringify(data)}`);

    return data;
  }

  @MessagePattern('auth.signup')
  async signup(
    @Payload('value')
    {
      name,
      password,
      email,
      phone,
    }: {
      name: string;
      password: string;
      email: string;
      phone: string;
    },
  ): Promise<any> {
    this.logger.log(
      `Signup user: ${JSON.stringify({
        name,
        password,
        email,
        phone,
      })}`,
    );

    return await this.authService.signup({
      name,
      password,
      email,
      phone,
    });
  }

  @MessagePattern('auth.load-user-by-email')
  async verifyEmailExists(
    @Payload('value') { email }: { email: string },
  ): Promise<User> {
    return await this.userService.loadByEmail({
      email,
    });
  }
}
