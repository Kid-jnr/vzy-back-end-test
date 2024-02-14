import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    return this.prismaService.user.create({ data });
  }

  async getUser(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params;
    return this.prismaService.user.findUnique({ where,
      select: {
        id: true,
        email: true,
        paymentStatus: true,
        password: false,
        createdAt:true,
        updatedAt:true
      },
     });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;

    return this.prismaService.user.update({ where, data,  select: {
      id: true,
      email: true,
      paymentStatus: true,
      password: false,
      createdAt:true,
      updatedAt:true
    }, });
  }
}
