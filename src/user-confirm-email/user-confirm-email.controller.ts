import { UserConfirmEmailService } from '@/user-confirm-email/user-confirm-email.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user-confirm-email')
export class UserConfirmEmailController {
  private readonly logger = new Logger(UserConfirmEmailController.name);

  constructor(
    private readonly userConfirmEmailService: UserConfirmEmailService,
  ) {}

  @MessagePattern('auth.resend-signup-confirm-email')
  async resendSignupConfirmEmail(
    @Payload('value')
    {
      email,
      baseUrlConfirmation,
    }: {
      email: string;
      baseUrlConfirmation: string;
    },
  ): Promise<void> {
    this.logger.log(
      `Resend signup confirm email user: ${JSON.stringify({
        email,
        baseUrlConfirmation,
      })}`,
    );

    await this.userConfirmEmailService.resendSignupConfirmEmail({
      email,
      baseUrlConfirmation,
    });
  }

  @MessagePattern('auth.signup-confirm-email')
  async signupConfirmEmail(
    @Payload('value')
    { confirmToken }: { confirmToken: string },
  ): Promise<void> {
    this.logger.log(
      `Confirm signup confirm email: ${JSON.stringify({
        confirmToken,
      })}`,
    );

    await this.userConfirmEmailService.signupConfirmEmail({
      confirmToken,
    });
  }
}
