import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import rawBodyMiddleware from './utils/rawBody.middleware';
import { HttpExceptionFilter } from './filters';
import { ValidationPipe } from './pipes';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('NestApplication');

  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE,PATCH',
    allowedHeaders: 'Content-Type, Origin,Authorization',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(rawBodyMiddleware());
  app.setGlobalPrefix('/api');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
