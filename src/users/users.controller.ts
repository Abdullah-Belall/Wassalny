import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignInDto } from './dto/sign-in.dto';
import type { Response } from 'express';
import { User } from './decorators/user.decorator';
import type { UserTokenInterface } from './types/interfaces/user-token.interface';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.usersService.register(registerDto);
    return await this.usersService.signIn({
      password: registerDto.password,
      phone: registerDto.phone
    }, res);
  }

  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.usersService.signIn(signInDto, res);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async signOut(@Res({ passthrough: true }) res: Response) {
    return await this.usersService.signOut(res);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@User() { id }: UserTokenInterface) {
    return await this.usersService.profile(id);
  }
}
