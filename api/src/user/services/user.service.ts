import { from, map, mapTo, Observable, switchMap } from 'rxjs';
import { IUser } from '../model/user.interface';
import { UserEntity } from '../model/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  findAll(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  login(user: IUser): Observable<string> {
    return this.findOneByEmail(user.email).pipe(
      switchMap((foundUser: IUser) => {
        if (!foundUser)
          throw new BadRequestException(
            `No user with email ${user.email} found`,
          );

        return this.authService
          .validatePassword(user.password, foundUser.password)
          .pipe(
            switchMap((matches: boolean) => {
              if (!matches)
                throw new BadRequestException(`Credentials are wrong`);

              return this.findOneById(foundUser.id).pipe(
                switchMap((user: IUser) => this.authService.generateJwt(user)),
              );
            }),
          );
      }),
    );
  }

  create(newUser: IUser): Observable<IUser> {
    const onEmailExists = (exists: boolean) => {
      if (exists)
        throw new BadRequestException(
          `User with such email or username already exists`,
        );

      return this.authService
        .hashPassword(newUser.password)
        .pipe(
          switchMap((passwordHash: string) => onPasswordHashed(passwordHash)),
        );
    };
    const onPasswordHashed = (passwordHash: string) => {
      // overwrite the user password with the hash
      newUser.password = passwordHash;
      return from(this.userRepository.save(newUser)).pipe(
        switchMap((user: IUser) => this.findOneById(user.id)),
      );
    };
    return this.mailOrUserExists(newUser.email, newUser.username).pipe(
      switchMap((exists: boolean) => onEmailExists(exists)),
    );
  }

  private findOneById(id: number): Observable<IUser> {
    return from(this.userRepository.findOne({ id }));
  }

  private findOneByEmail(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne(
        { email },
        { select: ['id', 'email', 'username', 'password'] },
      ),
    );
  }

  private mailOrUserExists(
    email: string,
    username: string,
  ): Observable<boolean> {
    const potentialUserByEmailOrUsername = from(
      this.userRepository.findOne({ where: [{ email }, { username }] }),
    ).pipe(map((user: IUser) => !!user));
    return potentialUserByEmailOrUsername;
  }
}
