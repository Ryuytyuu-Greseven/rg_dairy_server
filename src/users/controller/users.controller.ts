import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserNameDto } from 'src/dtos/username.dto';
import { SignupDto } from 'src/dtos/signup.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookCreationDto } from 'src/dtos/book-creation.dto';
import { DairyDetailsDto } from 'src/dtos/dairy-details.dto';
import { NewPageDto } from 'src/dtos/new-page.dto';
import { VerifyDto } from 'src/dtos/verify-user.dto';
import { ResendOtpDto } from 'src/dtos/resend-otp.dto';
import { ForgotPassDto } from 'src/dtos/forgot-pass.dto';
import { Public } from 'src/auth/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('details')
  fetchUserDetails(@Req() request: Request) {
    const userDetails = request['user'];
    return this.userService.getUserDetails(userDetails.username);
  }

  @Post('login')
  loginRequest(@Body() userDetails: LoginDto) {
    return this.userService.checkLogin(userDetails);
  }

  @Post('signup')
  signupRequest(@Body() userDetails: SignupDto) {
    return this.userService.signUpUser(userDetails);
  }

  @Post('verify')
  verifyRequest(@Body() userDetails: VerifyDto) {
    return this.userService.verifyUser(userDetails);
  }
  @Post('resend_otp')
  resendVerificationRequest(@Body() userDetails: ResendOtpDto) {
    return this.userService.regenerateOtp(userDetails);
  }

  @Post('pass_reset')
  requestPassReset(@Body() userDetails: ForgotPassDto) {
    return this.userService.forgotPassword(userDetails);
  }

  // ===================  BOOKS  ===================  //
  @UseGuards(AuthGuard)
  @Post('create')
  createBook(@Body() bookDetails: BookCreationDto, @Req() request: Request) {
    return this.userService.addNewBook(bookDetails, request);
  }

  @UseGuards(AuthGuard)
  @Post('self-dairies')
  fetchBooks(@Body() body: any, @Req() request: Request) {
    return this.userService.getBooks(body, request);
  }

  @Public()
  @Post('public-dairies')
  fetchPublicBooks(@Body() body: any, @Req() request: Request) {
    return this.userService.getPublicBooks(body, request);
  }

  @UseGuards(AuthGuard)
  @Post('dairy-details')
  dairyDetails(@Body() body: DairyDetailsDto, @Req() request: Request) {
    return this.userService.getDairyDetails(body, request);
  }

  @Public()
  @Post('public-dairy-details')
  publicDairyDetails(@Body() body: any, @Req() request: Request) {
    return this.userService.getPublicDairyDetails(body, request);
  }

  @UseGuards(AuthGuard)
  @Post('save-page')
  saveDairyPage(@Body() body: NewPageDto, @Req() request: Request) {
    return this.userService.savePage(body, request);
  }

  @UseGuards(AuthGuard)
  @Post('pages')
  fetchPages(@Body() body: DairyDetailsDto, @Req() request: Request) {
    return this.userService.getPages(body, request);
  }
  @Post('public-pages')
  fetchPublicPages(@Body() body: DairyDetailsDto, @Req() request: Request) {
    return this.userService.getPublicPages(body, request);
  }
}
