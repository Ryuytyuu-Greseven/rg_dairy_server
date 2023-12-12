import {
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class BookCreationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  year: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  font: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(7)
  bookColor: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(7)
  titleColor: string;
}