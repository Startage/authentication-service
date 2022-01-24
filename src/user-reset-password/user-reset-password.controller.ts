import { UserResetPasswordService } from '@/user-reset-password/user-reset-password.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user-reset-password')
export class UserResetPasswordController {
  private readonly logger = new Logger(UserResetPasswordController.name);

  constructor(
    private readonly userResetPasswordService: UserResetPasswordService,
  ) {}

  @MessagePattern('auth.request-reset-password')
  async requestResetPassword(
    @Payload('value')
    {
      email,
      baseUrlResetPassword,
    }: {
      email: string;
      baseUrlResetPassword: string;
    },
  ): Promise<void> {
    this.logger.log(
      `Request reset password user: ${JSON.stringify({
        email,
        baseUrlResetPassword,
      })}`,
    );

    await this.userResetPasswordService.requestResetPassword({
      email,
      baseUrlResetPassword,
    });
  }

  @MessagePattern('auth.apply-reset-password')
  async applyResetPassword(
    @Payload('value')
    { id, password }: { id: string; password: string },
  ): Promise<void> {
    this.logger.log(
      `Apply reset password user: ${JSON.stringify({
        id,
      })}`,
    );

    await this.userResetPasswordService.applyResetPassword({
      id,
      password,
    });
  }
}
