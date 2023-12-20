import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ForgotPassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password;
}
