import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/utils';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      ErrorHelper.BadRequestException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      ErrorHelper.BadRequestException('Invalid password');
    }
    return await this.signUserToken(user);
  }

  async register(payload: RegisterUserDto) {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (emailExists) {
      ErrorHelper.ConflictException(
        `User with email "${payload.email}" already exist`,
      );
    }
    const newUser = await this.userService.register(payload);

    return await this.signUserToken(newUser);
  }

  private async signUserToken(user: any) {
    const userInfo = {
      email: user.email,
      id: user.id,
      paymentStatus: user.paymentStatus
    };

    const token = this.jwtService.sign(userInfo);

    return {
      ...userInfo,
      accessToken: token,
    };
  }

}
