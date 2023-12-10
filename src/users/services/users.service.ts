import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  getUserDetails = async (userName: string) => {
    log('Fetching User Details:', userName);
    const userDetails = await this.UserModel.findOne({ username: userName });
    log('User Details:', userDetails);
    return { details: userDetails };
  };
}
