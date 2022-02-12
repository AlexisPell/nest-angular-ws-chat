import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ILoginResponse } from './model/login-res.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { UserHelperService } from './services/user-helper.service';
import { CreateUserDto } from './dto/create-user.dto';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserService } from './services/user.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { IUser } from './model/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { URL } from 'url';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      limit,
      page,
      route: `${process.env.SERVER_URL}/api/users`,
    });
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<IUser> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user: IUser) => this.userService.create(user)));
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Observable<ILoginResponse> {
    return this.userHelperService
      .loginUserDtoToEntity(loginUserDto)
      .pipe(switchMap((user: IUser) => this.userService.login(user)))
      .pipe(
        map((jwt: string) => {
          const loginResponse: ILoginResponse = {
            access_token: jwt,
            token_type: 'JWT',
            expires_in: '30d',
          };
          return loginResponse;
        }),
      );
  }
}
