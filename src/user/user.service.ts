import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) { }

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: { username: registerRequest.username },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException(`Username Already Exist`, 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      id: user.id,
      username: user.username,
    };
  }


  identificationFailed() {
    throw new HttpException(`Username or password is invalid`, 401);
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(UserValidation.LOGIN, request);

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });


    if (!user) {
      this.identificationFailed();
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
      this.identificationFailed();
    }

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username
      },
      data: {
        token: uuid(),
      }
    });

    return {
      id: user.id,
      username: user.username,
      token: user.token
    }
  }

  async get(user: User): Promise<UserResponse> {
    return {
      id: user.id,
      username: user.username,
    }
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.update(${user.id}, ${request.username})`);
    const updateRequest: UpdateUserRequest = this.validationService.validate(UserValidation.UPDATE, request);

    if (updateRequest.username) {
      user.username = updateRequest.username;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        password: user.password
      },
    });

    return {
      id: result.id,
      username: result.username,
    }
  }
}
