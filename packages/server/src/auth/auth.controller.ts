import {
  Controller,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Post,
  Body,
  ValidationPipe,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorator/auth.decorator';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Auth(AuthType.None)
  @Post('/client/register/')
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        name: user.name,
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      throw new ConflictException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('/auth/login/')
  async find(
    @Res({ passthrough: true }) response: Response,
    @Body(new ValidationPipe()) signInUserDto: SignInUserDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.find(
      signInUserDto,
    );
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
  @Post('/auth/logout/')
  async logout(@Res() response: Response, @Req() request: Request) {
    console.log(request.cookies);
    response.clearCookie('accessToken', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/auth/refresh/')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      request.cookies['refreshToken'],
    );
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
