import { Body, Controller, Post } from '@nestjs/common';
import {
  SwaggerConflict,
  SwaggerInternalServerError,
  SwaggerOperation,
  SwaggerUnauthorized,
} from 'src/common/settings/swagger/swagger.decorators';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @SwaggerOperation('Authenticate user and return the access token')
  @SwaggerUnauthorized('Invalid credentials')
  @SwaggerInternalServerError()
  public async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const { userEntity, token } = await this.authService.login(dto);
    return AuthResponseDto.fromEntity(userEntity, token);
  }

  @Post('/register')
  @SwaggerOperation('Register user and return the access token')
  @SwaggerConflict('Email already in use')
  @SwaggerInternalServerError()
  public async register(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    const { userEntity, token } = await this.authService.register(dto);
    return AuthResponseDto.fromEntity(userEntity, token);
  }
}
