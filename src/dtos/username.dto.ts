import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserNameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username;
}
