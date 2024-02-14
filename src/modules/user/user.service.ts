import { Injectable,Inject } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { ErrorHelper, PasswordHelper} from 'src/utils';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { STRIPE_WEBHOOK_SECRET } from 'src/base/config';
import { STRIPE_TOKEN } from '@sjnprjl/nestjs-stripe'; 
import Stripe from 'stripe';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userRepository: UserRepository,
    @Inject(STRIPE_TOKEN) private stripeClient: Stripe
  ) {}

  async register(userInfo: CreateUserDto) {
    const hashedPassword = await PasswordHelper.hashPassword(userInfo.password);
    userInfo.password = hashedPassword;
    const user = await this.userRepository.createUser({data: userInfo});
    return user;
  }


  async findOne(id: string) {
    return await this.userRepository.getUser({
      where: { id }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return await this.userRepository.updateUser({
      where: { id },
      data: updateUserDto
    });
  }

  
  async webHookListen(req: Buffer, signature: string) {
    try {
      const event = this.stripeClient.webhooks.constructEvent(
        req,
        signature,
        STRIPE_WEBHOOK_SECRET,
      );
      let data: { customerId: string; paymentStatus: string };
      // Handle the event based on the event type
      switch (event.type) {
        case 'invoice.payment_succeeded':
          if (event.data.object['paid'] == true) {
            const invoicePaymentSucceeded = event.data.object;
            const customerId = invoicePaymentSucceeded['customer'];
            data = {
              customerId,
              paymentStatus: "paid",
            };
          }
          break;
      }
      return data;
    } catch (err) {
      // Replace with emitting error event or logging 
      console.error(err);
    }
  }

}
