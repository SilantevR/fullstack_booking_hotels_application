import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors({
    origin: config.get('SOKET_ORIGIN'),
    credentials: true,
  });
  await app.listen(5000, '127.0.0.1');
}
bootstrap();
