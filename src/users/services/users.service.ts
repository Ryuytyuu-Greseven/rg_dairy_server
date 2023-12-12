import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { log } from 'console';

import { User } from 'src/schemas/users.schema';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from 'src/constants/contants';
import { SignupDto } from 'src/dtos/signup.dto';
import { Book } from 'src/schemas/books.schema';
import { BookCreationDto } from 'src/dtos/book-creation.dto';
import { Request } from 'express';

@Injectable()
export class UsersService {
  // encryption
  salt = 11.4;

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Book.name) private BookModel: Model<Book>,
    private jwtService: JwtService,
  ) {}

  async fetchDetails(username: string, email: string) {
    let result: any = {};

    const userDetails = await this.UserModel.find().where({
      $or: [{ username }, { email }],
    });

    console.log(userDetails);

    if (userDetails.length) {
      result = userDetails[0];
    } else {
      result = {};
    }

    return result;
  }

  async jwtLogin(payload: any) {
    console.log('in jwt', payload);
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '600m' }),
    };
  }

  // checks and logins in user
  async checkLogin(body: LoginDto) {
    const result = {
      data: { access_token: '', email: '', profilename: '', username: '' },
      success: true,
      message: '',
    };
    try {
      // const decodedBody: any = await this.cryptService.decrypt(request);
      // console.log(decodedBody);

      const userDetails: any = await this.fetchDetails(body.username, '');

      if (userDetails.username) {
        if (await compare(body.password, userDetails.password)) {
          result.success = true;
          result.data.email = userDetails.email;
          result.data.username = userDetails.username;
          result.data.profilename = userDetails.profilename;

          const { access_token } = await this.jwtLogin({
            email: userDetails.email,
            username: userDetails.username,
            profilename: userDetails.profilename,
          });
          result.data.access_token = access_token;
          result.message = ERROR_MESSAGES.login_success;
        } else {
          result.success = false;
          result.message = ERROR_MESSAGES.no_user;
        }
      } else {
        result.success = false;
        result.message = ERROR_MESSAGES.no_user;
      }
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.internal_error;
    }
    // const output = await this.cryptService.encrypt(request, result);
    return result;
  }

  async signUpUser(body: SignupDto) {
    const result = { data: {}, success: true, message: '' };
    try {
      // const decodedBody: any = await this.cryptService.decrypt(request);
      console.log(body);

      const userDetails: any = await this.fetchDetails(
        body.username,
        body.email,
      );

      if (!userDetails.email) {
        console.log('check', body);

        const enc_password = await this.encPass(body.password);
        const login = new this.UserModel({
          email: body.email,
          password: enc_password,
          personalNumber: '',
          profilename: body.profilename,
          username: body.username,
        });

        const response = await login.save();
        console.log(response);

        // result.data = await this.jwtLogin({
        //   email: response.email,
        //   username: response.username,
        //   profilename: response.profilename,
        // });

        result.message = ERROR_MESSAGES.account_created;
      } else {
        result.success = false;
        result.message = ERROR_MESSAGES.account_exists;
      }
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.internal_error;
    }
    // const output = await this.cryptService.encrypt(request, result);
    return result;
  }

  // fetching user details from database
  getUserDetails = async (userName: string) => {
    log('Fetching User Details:', userName);
    const userDetails = await this.UserModel.findOne({ username: userName });
    log('User Details:', userDetails);
    return { details: userDetails };
  };

  async encPass(password: string) {
    return await hash(password, this.salt);
  }

  // ========================  BOOK  =============================  //

  async addNewBook(body: BookCreationDto, request: Request) {
    const result = {
      success: true,
      message: '',
      data: {},
    };

    try {
      const userDetails = request['user'];
      console.log(userDetails, result);

      const response = await this.BookModel.insertMany([
        {
          title: body.title,
          year: body.year,
          genre: '',
          author: userDetails.username,
          titleConfig: {
            font: body.font,
            color: body.titleColor,
          },
          bookConfig: { color: body.bookColor },
        },
      ]);
      log('Dairy Insertion', response);
      result.message = ERROR_MESSAGES.dairy_created;
    } catch (error) {
      log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.dairy_creation_error;
    }
    return result;
  }

  async getBooks(body: any, request: Request) {
    const result = {
      success: true,
      message: '',
      data: {},
    };

    try {
      const userDetails = request['user'];
      console.log(userDetails, result);

      const response = await this.BookModel.find({
        author: userDetails.username,
      });

      log('My Dairies', response);
      result.data = response;
      result.message = ERROR_MESSAGES.fetch_success;
    } catch (error) {
      log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.dairy_fetch_failure;
    }
    return result;
  }
}
