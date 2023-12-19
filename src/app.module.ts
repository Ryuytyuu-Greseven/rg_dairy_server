import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { CryptoService } from './crypto.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './middlewares/interceptors/global.interceptor';
import { GlobalExceptionFilter } from './Exceptions/global-exception.filters';

config();
@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DISC_URL}`),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    CryptoService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: GlobalInterceptor },
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
