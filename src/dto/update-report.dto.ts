import { IsNumber, IsString } from 'class-validator';

export class updateReportDto {
  @IsString()
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsString()
  year: number;

  @IsString()
  lng: number;

  @IsString()
  lat: number;

  @IsString()
  mileage: number;
}

export default updateReportDto;
