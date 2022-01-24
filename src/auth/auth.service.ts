import { CustomClientKafka } from '@/common/custom-client-kafka';
import { EmailIsNotConfirmedError } from '@/common/errors/email-is-not-confirmed-error';
import { PrismaService } from '@/prisma.service';
import { UserConfirmEmailService } from '@/user-confirm-email/user-confirm-email.service';
import { UserRefreshTokenService } from '@/user-refresh-token/user-refresh-token.service';
import { UserService } from '@/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserRefreshToken } from '@prisma/client';
import add from 'date-fns/add';

@Injectable()
export class AuthService {
  EXPIRED_AT_CONFIRM_EMAIL: number;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly userConfirmEmailService: UserConfirmEmailService,
    private readonly userRefreshTokenService: UserRefreshTokenService,
    private readonly configService: ConfigService,
    @Inject('NOTIFICATION_KAFKA_SERVICE')
    private clientNotification: CustomClientKafka,
  ) {
    this.EXPIRED_AT_CONFIRM_EMAIL = parseInt(
      configService.get('EXPIRED_AT_CONFIRM_EMAIL'),
    );
  }

  async signup({
    email,
    name,
    phone,
    password,
    baseUrlConfirmation,
  }: {
    email: string;
    name: string;
    phone: string;
    password: string;
    baseUrlConfirmation: string;
  }): Promise<{ id: string }> {
    let user;
    let userConfirmEmail;
    const expiredAt = this.EXPIRED_AT_CONFIRM_EMAIL
      ? add(new Date(), { days: this.EXPIRED_AT_CONFIRM_EMAIL })
      : null;
    await this.prismaService.$transaction(async (prisma) => {
      user = await this.userService.create(
        {
          email,
          name,
          phone,
          password,
          isConfirmedEmail: false,
        },
        prisma,
      );
      userConfirmEmail = await this.userConfirmEmailService.create(
        {
          userId: user.id,
          expiredAt,
        },
        prisma,
      );
    });
    this.clientNotification.emit('notification.signup', {
      name,
      email,
      phone,
      userReference: user.id,
      confirmToken: userConfirmEmail.id,
      baseUrlConfirmation,
    });
    return { id: user.id };
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    user: Omit<User, 'password'>;
    refreshToken: UserRefreshToken;
  }> {
    const user = await this.userService.loadByEmail({
      email,
    });
    if (user) {
      const { password: hashedPassword, ...result } = user;
      const isValidPassword = this.userService.isValidPassword({
        hashedPassword,
        currentPassword: password,
      });
      if (isValidPassword) {
        if (!user.isConfirmedEmail) {
          throw new EmailIsNotConfirmedError();
        }
        const refreshToken = await this.userRefreshTokenService.create({
          userId: user.id,
          createdAt: new Date(),
        });
        return {
          user: result,
          refreshToken,
        };
      }
    }
    return null;
  }
}
