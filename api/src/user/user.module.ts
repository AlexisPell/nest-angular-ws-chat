import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserHelperService } from './services/user-helper.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
})
export class UserModule {}
