import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) { }
  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;
    this.logger.debug(`Token ${token}`);
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
