import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Auth(AuthType.None)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async find(
    @Res({ passthrough: true }) response: Response,
    @Body(new ValidationPipe()) signInUserDto: SignInUserDto,
  ) {
    const {accessToken, refreshToken}= await this.usersService.find(signInUserDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    //return {accessToken, refreshToken};
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    const {accessToken, refreshToken} = await this.usersService.refreshTokens(refreshTokenDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    //return {accessToken, refreshToken};
  }
}
