import { CustomClientKafka } from '@/common/custom-client-kafka';
import { PrismaService } from '@/prisma.service';
import { UserService } from '@/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAfter } from 'date-fns';
import add from 'date-fns/add';

@Injectable()
export class UserResetPasswordService {
  EXPIRED_AT_RESET_PASSWORD: number;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject('NOTIFICATION_KAFKA_SERVICE')
    private clientNotification: CustomClientKafka,
  ) {
    this.EXPIRED_AT_RESET_PASSWORD = parseInt(
      configService.get('EXPIRED_AT_RESET_PASSWORD'),
    );
  }

  async requestResetPassword({
    email,
    baseUrlResetPassword,
  }: {
    email: string;
    baseUrlResetPassword: string;
  }) {
    const user = await this.userService.loadByEmail({ email });
    if (user) {
      const expiredAt = this.EXPIRED_AT_RESET_PASSWORD
        ? add(new Date(), { days: this.EXPIRED_AT_RESET_PASSWORD })
        : null;
      const [resetPassword] = await this.prismaService.$transaction([
        this.prismaService.userResetPassword.create({
          data: {
            userId: user.id,
            expiredAt,
          },
        }),
        this.prismaService.userResetPassword.updateMany({
          data: {
            userId: user.id,
            disabledAt: new Date(),
          },
        }),
      ]);
      this.clientNotification.emit('notification.request-reset-password', {
        email,
        baseUrlResetPassword,
        resetPasswordToken: resetPassword.id,
      });
    }
  }

  async applyResetPassword({ id, password }: { id: string; password: string }) {
    const resetPassword = await this.prismaService.userResetPassword.findUnique(
      {
        where: {
          id,
        },
      },
    );
    if (!resetPassword) throw new Error('Not find request reset password');
    if (resetPassword.appliedAt) throw new Error('Request already applied');
    if (isAfter(new Date(), resetPassword.expiredAt))
      throw new Error('Request password is expired');
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.userResetPassword.update({
        data: {
          appliedAt: new Date(),
        },
        where: {
          id: resetPassword.id,
        },
      });
      await this.userService.updatePasswordById(
        {
          userId: resetPassword.userId,
          password,
        },
        prisma,
      );
    });
  }
}
