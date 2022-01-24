import { AuthService } from '@/auth/auth.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User, UserRefreshToken } from '@prisma/client';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(
    @Payload('value') { email, password }: { email: string; password: string },
  ): Promise<{
    user: Omit<User, 'password'>;
    refreshToken: UserRefreshToken;
  }> {
    this.logger.log(
      `Login user: ${JSON.stringify({
        email,
      })}`,
    );
    return this.authService.login({ email, password });
  }

  @MessagePattern('auth.signup')
  async signup(
    @Payload('value')
    {
      name,
      password,
      email,
      phone,
      baseUrlConfirmation,
    }: {
      name: string;
      password: string;
      email: string;
      phone: string;
      baseUrlConfirmation: string;
    },
  ): Promise<{ id: string }> {
    this.logger.log(
      `Signup user: ${JSON.stringify({
        name,
        email,
        phone,
        baseUrlConfirmation,
      })}`,
    );

    return await this.authService.signup({
      name,
      password,
      email,
      phone,
      baseUrlConfirmation,
    });
  }
}
