import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { UserRepository } from './user.repository';
import { StripeModule } from '@sjnprjl/nestjs-stripe';
import { STRIPE_SECRET_KEY } from "src/base/config";

@Module({
  imports: [PrismaModule,
    StripeModule.forRoot({
      apiKey: STRIPE_SECRET_KEY,
      config: {
        apiVersion: '2022-08-01',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports: [UserService],
})
export class UserModule {}
