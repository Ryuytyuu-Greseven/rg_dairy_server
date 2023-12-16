import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(30)
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  otp: string;
}
