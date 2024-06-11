import { IsEmail, IsString } from 'class-validator';

export class updateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export default updateUserDto;
