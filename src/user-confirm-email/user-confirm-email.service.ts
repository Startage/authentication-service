import { CustomClientKafka } from '@/common/custom-client-kafka';
import { PrismaService } from '@/prisma.service';
import { UserConfirmedEmailService } from '@/user-confirmed-email/user-confirmed-email.service';
import { UserService } from '@/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserConfirmEmail } from '@prisma/client';
import { PrismaClient } from '@prisma/client/scripts/default-index';
import { isAfter } from 'date-fns';
import add from 'date-fns/add';

@Injectable()
export class UserConfirmEmailService {
  EXPIRED_AT_CONFIRM_EMAIL: number;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject('NOTIFICATION_KAFKA_SERVICE')
    private clientNotification: CustomClientKafka,
    private readonly userConfirmedEmailService: UserConfirmedEmailService,
  ) {
    this.EXPIRED_AT_CONFIRM_EMAIL = parseInt(
      configService.get('EXPIRED_AT_CONFIRM_EMAIL'),
    );
  }

  async create(
    data: Omit<
      UserConfirmEmail,
      'id' | 'updatedAt' | 'createdAt' | 'disabledAt'
    >,
    prismaClient?: PrismaClient,
  ): Promise<UserConfirmEmail> {
    return (prismaClient || this.prismaService).userConfirmEmail.create({
      data,
    });
  }

  async resendByUserId(
    data: Omit<UserConfirmEmail, 'id' | 'updatedAt' | 'createdAt'>,
    prismaClient?: PrismaClient,
  ): Promise<UserConfirmEmail> {
    await (prismaClient || this.prismaService).userConfirmEmail.updateMany({
      where: {
        userId: data.userId,
      },
      data: {
        disabledAt: new Date(),
      },
    });
    return this.create(data, prismaClient);
  }

  async resendSignupConfirmEmail({
    email,
    baseUrlConfirmation,
  }: {
    email: string;
    baseUrlConfirmation: string;
  }) {
    const user = await this.userService.loadByEmail({ email });
    if (user.isConfirmedEmail) throw new Error('User has confirmed email');
    const expiredAt = this.EXPIRED_AT_CONFIRM_EMAIL
      ? add(new Date(), { days: this.EXPIRED_AT_CONFIRM_EMAIL })
      : null;
    const userConfirmEmail = await this.create({
      userId: user.id,
      expiredAt,
    });
    this.clientNotification.emit('notification.resend-signup-confirm-email', {
      email,
      confirmToken: userConfirmEmail.id,
      baseUrlConfirmation,
    });
  }

  async signupConfirmEmail({ confirmToken }: { confirmToken: string }) {
    const userConfirmEmail =
      await this.prismaService.userConfirmEmail.findUnique({
        where: {
          id: confirmToken,
        },
      });
    if (!userConfirmEmail || userConfirmEmail.disabledAt)
      throw new Error('Not found confirm email');
    if (isAfter(new Date(), userConfirmEmail.expiredAt))
      throw new Error('Confirm email is expired');
    const userConfirmedEmail =
      await this.userConfirmedEmailService.loadByUserConfirmEmailId({
        userConfirmEmailId: userConfirmEmail.id,
      });
    if (userConfirmedEmail) throw new Error('The token has already been used');
    await this.prismaService.$transaction(async (prisma) => {
      await this.userService.updateIsConfirmedEmailById(
        {
          userId: userConfirmEmail.userId,
          isConfirmedEmail: true,
        },
        prisma,
      );
      await this.userConfirmedEmailService.create(
        {
          userId: userConfirmEmail.userId,
          userConfirmEmailId: userConfirmEmail.id,
        },
        prisma,
      );
    });
  }
}
