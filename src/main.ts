import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
// import { GlobalExceptionFilter } from './Exceptions/global-exception.filters';
// import { CryptoService } from './crypto.service';

config();
const { RUNNER_PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  log(RUNNER_PORT);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // const httpAdapter = app.get(HttpAdapterHost);
  // const cryptoService = app.get(CryptoService);

  // app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter, cryptoService));

  await app.listen(RUNNER_PORT);
}
bootstrap();
