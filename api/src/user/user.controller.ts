import { LoginUserDto } from './dto/login-user.dto';
import { UserHelperService } from './service/user-helper.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, of, switchMap } from 'rxjs';
import { UserService } from './service/user.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  login(@Body() loginUserDto: LoginUserDto): Observable<boolean> {
    return this.userHelperService
      .loginUserDtoToEntity(loginUserDto)
      .pipe(switchMap((user: IUser) => this.userService.login(user)));
  }
}
