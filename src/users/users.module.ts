import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { GlobalExceptionFilter } from 'src/Exceptions/global-exception.filters';
import { config } from 'dotenv';

config();
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '600m' },
    }),
  ],
  providers: [
    UsersService,
    { provide: 'APP_FILTER', useClass: GlobalExceptionFilter },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
