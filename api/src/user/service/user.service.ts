import { from, map, mapTo, Observable, switchMap } from 'rxjs';
import { IUser } from './../model/user.interface';
import { UserEntity } from './../model/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findAll(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  // TODO: Refactor to jwt later
  login(user: IUser): Observable<boolean> {
    return this.findOneByEmail(user.email).pipe(
      switchMap((foundUser: IUser) => {
        if (!foundUser)
          throw new BadRequestException(
            `No user with email ${user.email} found`,
          );

        return this.validatePassword(user.password, foundUser.password).pipe(
          switchMap((matches: boolean) => {
            if (!matches)
              throw new BadRequestException(`Credentials are wrong`);

            return this.findOneById(foundUser.id).pipe(mapTo(true));
          }),
        );
      }),
    );
  }

  create(newUser: IUser): Observable<IUser> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (exists)
          throw new BadRequestException(
            `User with email ${newUser.email} already exists`,
          );

        return this.hashPassword(newUser.password).pipe(
          switchMap((passwordHash: string) => {
            // overwrite the user password with the hash
            newUser.password = passwordHash;
            return from(this.userRepository.save(newUser)).pipe(
              switchMap((user: IUser) => this.findOneById(user.id)),
            );
          }),
        );
      }),
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

  private validatePassword(
    password: string,
    storedPassword: string,
  ): Observable<boolean | any> {
    return from(bcrypt.compare(password, storedPassword));
  }

  private hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 10) as any);
  }

  private mailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ email })).pipe(
      map((user: IUser) => !!user),
    );
  }
}
