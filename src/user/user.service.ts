import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

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
    this.logger.debug(isPasswordValid);

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
}
