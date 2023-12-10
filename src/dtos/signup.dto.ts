import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
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

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  profilename;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  email;
}
