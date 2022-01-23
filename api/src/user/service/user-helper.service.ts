import { LoginUserDto } from './../dto/login-user.dto';
import { IUser } from './../model/user.interface';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from './../dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): Observable<IUser> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<IUser> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
