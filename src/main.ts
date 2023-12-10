import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

config();
const { RUNNER_PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  log(RUNNER_PORT);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(RUNNER_PORT);
}
bootstrap();
