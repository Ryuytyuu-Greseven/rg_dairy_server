import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResendOtpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(30)
  userId: string;
}
