import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CustomRequest } from 'src/types/interfaces/custom-req.interface';
import { UsersDBService } from 'src/users/DB_Service/users_db.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersDBService: UsersDBService,
    private jwtService: JwtService,
  ) {}

  async use(req: CustomRequest, _: Response, next: () => void) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      req.user = null;
      next();
      return;
    }
    try {
      const verfiy = this.jwtService.verify(accessToken);
      delete verfiy.iat;
      delete verfiy.exp;

      const user = await this.usersDBService.findOne({
        where: {
          id: verfiy.id,
        },
      });
      if (!user) {
        req.user = null;
        next();
        return;
      }
      req.user = verfiy;
    } catch {
      req.user = null;
    }
    next();
  }
}
