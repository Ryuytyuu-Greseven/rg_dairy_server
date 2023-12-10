import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserNameDto } from 'src/dtos/username.dto';
import { SignupDto } from 'src/dtos/signup.dto';
import { LoginDto } from 'src/dtos/login.dto';

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
}
