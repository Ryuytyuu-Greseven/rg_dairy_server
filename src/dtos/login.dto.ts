import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password;
}
