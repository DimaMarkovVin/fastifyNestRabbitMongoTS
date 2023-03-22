import {
  IsOptional,
  IsInt,
  IsString,
  Min,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class GetDto {
  constructor(data: GetDto) {
    this.country = data.country;
    this.city = data.city;
    this.pageNumber = Number(data.pageNumber);
    this.amountPerPage = Number(data.amountPerPage);
  }

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  country: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  city: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  amountPerPage = 50;
}
