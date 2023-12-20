import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import * as nodeMailer from 'nodemailer';
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
import { DairyDetailsDto } from 'src/dtos/dairy-details.dto';
import { NewPageDto } from 'src/dtos/new-page.dto';
import { randomBytes } from 'crypto';
import { TempUser } from 'src/schemas/temp-user.schema';
import { VerifyDto } from 'src/dtos/verify-user.dto';
import { ResendOtpDto } from 'src/dtos/resend-otp.dto';
import { ForgotPassDto } from 'src/dtos/forgot-pass.dto';

@Injectable()
export class UsersService {
  // encryption
  salt = 11.4;

  constructor(
    @InjectModel(TempUser.name) private TempUserModel: Model<TempUser>,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Book.name) private BookModel: Model<Book>,
    private jwtService: JwtService,
    private configService: ConfigService,
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
  async fetchTempUserDetails(userId: string) {
    const [userDetails] = await this.TempUserModel.find({ _id: userId });
    console.log(userDetails);

    return userDetails;
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
    const result = { data: {}, success: true, message: '', userId: '' };
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
        const otp = this.randomStringGenerator(2);

        await this.sendMailToUser(body.email, otp);

        const login = new this.TempUserModel({
          email: body.email,
          password: enc_password,
          personalNumber: '',
          profilename: body.profilename,
          username: body.username,
          otp: otp,
        });

        const response = await login.save();
        console.log(response);
        result.userId = `${response._id}`;

        // result.data = await this.jwtLogin({
        //   email: response.email,
        //   username: response.username,
        //   profilename: response.profilename,
        // });
        result.message = ERROR_MESSAGES.temp_user_success;
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

  // final step of signup process for the user verification
  async verifyUser(body: VerifyDto) {
    const result = { data: {}, success: true, message: '', userId: '' };
    try {
      console.log(body);

      const tempUserDetails = await this.fetchTempUserDetails(body.userId);

      if (
        tempUserDetails.email &&
        tempUserDetails.username === 'reset_password'
      ) {
        if (body.otp === tempUserDetails.otp) {
          console.log('check', body);
          const updateResponse = await this.UserModel.updateOne(
            { email: tempUserDetails.email },
            { password: tempUserDetails.password },
          );
          console.log('Update Pass', updateResponse);

          result.message = ERROR_MESSAGES.otp_verify_success;
        } else {
          result.success = false;
          result.message = ERROR_MESSAGES.otp_invalid;
        }
      } else if (tempUserDetails.email) {
        if (body.otp === tempUserDetails.otp) {
          console.log('check', body);

          const login = new this.UserModel({
            email: tempUserDetails.email,
            password: tempUserDetails.password,
            personalNumber: tempUserDetails.personalNumber,
            profilename: tempUserDetails.profilename,
            username: tempUserDetails.username,
          });

          const response = await login.save();
          console.log(response);

          result.message = ERROR_MESSAGES.account_created;
        } else {
          result.success = false;
          result.message = ERROR_MESSAGES.otp_invalid;
        }
      } else {
        result.success = false;
        result.message = ERROR_MESSAGES.otp_invalid;
      }
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.internal_error;
    }
    // const output = await this.cryptService.encrypt(request, result);
    return result;
  }

  // resend otp to USER
  async regenerateOtp(body: ResendOtpDto) {
    const result = { success: false, message: '', data: {} };

    try {
      console.log(body);

      const tempUserDetails = await this.fetchTempUserDetails(body.userId);

      if (tempUserDetails.email) {
        const otp = this.randomStringGenerator(2);
        await this.sendMailToUser(tempUserDetails.email, otp);
        await this.TempUserModel.updateOne(
          { _id: tempUserDetails._id },
          { otp },
        );

        result.message = ERROR_MESSAGES.otp_resend_success;
      } else {
        result.success = false;
        result.message = ERROR_MESSAGES.internal_error;
      }
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.internal_error;
    }

    return result;
  }

  // user request for password reset
  async forgotPassword(body: ForgotPassDto) {
    const result = { data: {}, success: true, message: '', userId: '' };
    try {
      console.log(body);
      const userDetails: any = await this.fetchDetails('', body.email);

      if (userDetails.email) {
        console.log('check', body);
        const enc_password = await this.encPass(body.password);

        const otp = this.randomStringGenerator(2);
        await this.sendMailToUser(body.email, otp);

        const login = new this.TempUserModel({
          email: body.email,
          password: enc_password,
          personalNumber: '',
          profilename: 'reset_password',
          username: 'reset_password',
          otp: otp,
        });

        const response = await login.save();
        console.log(response);
        result.userId = `${response._id}`;

        result.message = ERROR_MESSAGES.temp_user_success;
      } else {
        result.success = false;
        result.message = ERROR_MESSAGES.unable_to_process;
      }
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.internal_error;
    }
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
          pages: [{ pageNo: 1, config: {}, text: 'Write Something' }],
        },
      ]);
      log('Diary Insertion', response);
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

  async getDairyDetails(body: DairyDetailsDto, request: Request) {
    const result = {
      success: true,
      message: '',
      data: {},
    };

    try {
      const userDetails = request['user'];
      console.log(userDetails, result);

      const response = await this.BookModel.findOne({
        author: userDetails.username,
        _id: body.dairyId,
      });

      log('Fetched diary', response);
      result.data = response;
      result.message = ERROR_MESSAGES.fetch_success;
    } catch (error) {
      log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.dairy_fetch_failure;
    }
    return result;
  }

  // save a new page into dairy
  async savePage(body: NewPageDto, request: Request) {
    const result = {
      success: true,
      data: {},
      message: '',
    };

    try {
      const userDetails = request['user'];
      const newPage = { pageNo: body.pageNo, text: body.text, config: {} };
      const page = await this.BookModel.updateOne(
        { _id: body.bookId, author: userDetails.username },
        { $push: { pages: newPage } },
      );
      console.log('Added a new page', page);

      result.data = JSON.parse(JSON.stringify(page));
      result.message = ERROR_MESSAGES.page_saved;
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.page_save_failure;
    }
    return result;
  }

  // fetching the pages from dairy
  async getPages(body: DairyDetailsDto, request: Request) {
    const result = {
      success: true,
      data: {},
      message: '',
    };

    try {
      const userDetails = request['user'];

      const { pages } = await this.BookModel.findOne(
        {
          _id: body.dairyId,
          author: userDetails.username,
        },
        { pages: 1 },
      );
      result.data = pages;
      result.message = ERROR_MESSAGES.page_saved;
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = ERROR_MESSAGES.page_save_failure;
    }
    return result;
  }

  // async..await is not allowed in global scope, must use a wrapper
  async sendMailToUser(user_email: string, otp: string) {
    try {
      console.log(user_email, otp);
      let transporter: any = {};

      // create reusable transporter object using the default SMTP transport
      transporter = nodeMailer.createTransport({
        // name: 'mail.ryuytyuuspace.in',
        host: 'smpt.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        service: 'gmail',
        auth: {
          user: this.configService.get('EMAIL'), // generated ethereal user
          pass: this.configService.get('EMAIL_KEY'), // generated ethereal password
        },
        // tls: {
        //   rejectUnauthorized: false,
        // },
      });
      console.log('Its Done');

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"Diary 🐿️" <${this.configService.get('EMAIL')}>`, // sender address
        to: `${user_email}`, // "bar@example.com, baz@example.com" list of receivers
        subject: 'OTP Verification from Diary', // Subject line
        text: `OTP Verification from Diary`, // plain text body
        html: this.getEmailOtp(otp), // html body
      });
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // otp generation
  randomStringGenerator(count: number) {
    return randomBytes(count).toString('hex');
  }

  // get the message box of otp
  getEmailOtp(otp: string) {
    return `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Diary Email Verification OTP</title>
            <style>
              /* Reset default styles */
              body, h1, p {
                margin: 0;
                padding: 0;
              }
          
              /* Basic styling for the email content */
              body {
                font-family: Arial, sans-serif;
                background-color: #1f2222;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
          
              .container {
                max-width: 400px;
                padding: 40px;
                background-color: #000000;
                border-radius: 5px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                text-align: center;
              }

              .login-border {
                border-radius: 25px;
              }
          
              .signup-head {
                color: wheat;
                margin: 0px 10px 20px 25px;
              }
              
              .singup-label {
                color: whitesmoke;
                display: block;
                margin-left: 2px;
              }
              
              .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #009688;
                margin: 20px 0;
              }

              .website-info {
                margin-top: 15px;
                font-size: 14px;
                color: #999;
              }
            </style>
        </head>
        <body>
          <div class="container login-border">
            <h1 class="signup-head">Email Verification OTP</h1>
            <p class="singup-label">Your OTP (One-Time Password) for email verification is:</p>
            <p class="otp-code">${otp}</p>
            <p class="singup-label">Please use this code to verify your email address.</p>
            <p class="website-info">This email is sent from Diary. Visit us at <a href="http://diary.ryuytyuu.com"
                style="color: #009688; text-decoration: none;">diary.ryuytyuu.com</a>.
            </p>
        </div>
        </body>
      </html>
    `;
  }
}
