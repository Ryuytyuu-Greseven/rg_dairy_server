import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserNameDto } from 'src/dtos/username.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('details')
  fetchUserDetails(@Body() userDetails: UserNameDto) {
    return this.userService.getUserDetails(userDetails.username);
  }
  @Post('login')
  loginRequest(@Body() userDetails: UserNameDto) {
    return this.userService.getUserDetails(userDetails.username);
  }
  @Get('login')
  getloginRequest(@Body() userDetails: UserNameDto) {
    return this.userService.getUserDetails(userDetails.username);
  }
}
