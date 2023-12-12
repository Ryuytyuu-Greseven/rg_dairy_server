import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DairyDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(30)
  dairyId: string;
}
