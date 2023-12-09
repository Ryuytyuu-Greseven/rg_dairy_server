import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { config } from 'dotenv';

config();
const { RUNNER_PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  log(RUNNER_PORT);
  await app.listen(RUNNER_PORT);
}
bootstrap();
