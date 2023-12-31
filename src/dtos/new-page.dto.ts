import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class NewPageDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(3000)
  text: string;

  @IsNumber()
  @IsNotEmpty()
  pageNo: number;

  @IsString()
  @IsOptional()
  pageId: string;
}
