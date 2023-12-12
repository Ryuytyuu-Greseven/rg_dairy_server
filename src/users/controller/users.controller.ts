import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserNameDto } from 'src/dtos/username.dto';
import { SignupDto } from 'src/dtos/signup.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookCreationDto } from 'src/dtos/book-creation.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('details')
  fetchUserDetails(@Body() userDetails: UserNameDto) {
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
}