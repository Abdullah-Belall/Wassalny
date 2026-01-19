import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersDBService } from './DB_Service/users_db.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserTokenInterface } from './types/interfaces/user-token.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersDBService: UsersDBService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ phone, password }: SignInDto) {
    const isDublicated = await this.usersDBService.findOne({
      where: {
        phone
      }
    })
    if(isDublicated)
      throw new ConflictException()
    const hashedPass = await bcrypt.hash(password, 12)
    await this.usersDBService.save(this.usersDBService.instance({
      index: await this.usersDBService.nextIndex(),
      phone,
      password: hashedPass,
    }))
  }
  async signIn({ phone, password }: SignInDto, response: Response) {
    const user = await this.usersDBService.findOne({
      where: {
        phone,
      },
    });
    if (!user) {
      throw new NotFoundException(`No user found with this info.`);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Wrong password.');
    }
    const access_token = this.generateAccessToken({
      id: user.id,
      index: user.index,
      phone: user.phone,
    });
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
    });
    return {
      done: true,
      user: { ...user, password: undefined },
    };
  }
  async signOut(response: Response) {
    response.clearCookie('access_token', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return {
      done: true,
    };
  }
  async profile(id: string) {
    const user = await this.usersDBService.findOne({
      where: {
        id,
      },
    });
    return { ...user, password: undefined };
  }
  private generateAccessToken(payload: UserTokenInterface): string {
    return this.jwtService.sign(payload);
  }
}
