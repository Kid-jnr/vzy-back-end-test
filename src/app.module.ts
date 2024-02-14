import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envVarsSchema } from './helpers/env.validator';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './base';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    {
      ...JwtModule.register({
        secret: JWT_SECRET,
        signOptions: { expiresIn: '1m' },
      }),
      global: true,
    },
    PrismaModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
