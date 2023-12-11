import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class BookCreationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  title;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  year;
}
