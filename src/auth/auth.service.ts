import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signup({
    email,
    name,
    phone,
    password,
  }: {
    email: string;
    name: string;
    phone: string;
    password: string;
  }): Promise<{ id: string }> {
    const salt = Number(this.configService.get('ENCRYPT_SALT', 12));
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userService.create({
      email,
      name,
      phone,
      password: hashedPassword,
    });
    return { id: user.id };
  }
}
