import { UserRefreshTokenService } from '@/user-refresh-token/user-refresh-token.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user-refresh-token')
export class UserRefreshTokenController {
  private readonly logger = new Logger(UserRefreshTokenController.name);

  constructor(
    private readonly userRefreshTokenService: UserRefreshTokenService,
  ) {}

  @MessagePattern('auth.load-valid-refresh-token')
  async signup(
    @Payload('value')
    { refreshTokenId }: { refreshTokenId: string },
  ): Promise<{ id: string }> {
    this.logger.log(
      `Refreshtoken: ${JSON.stringify({
        refreshTokenId,
      })}`,
    );

    return await this.userRefreshTokenService.loadValid({
      refreshTokenId,
    });
  }
}
