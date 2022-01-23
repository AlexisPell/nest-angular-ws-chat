import { IsString, IsNotEmpty } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
