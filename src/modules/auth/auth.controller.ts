import { Body, Controller, Post } from '@nestjs/common';
import {
  SwaggerInternalServerError,
  SwaggerOperation,
  SwaggerUnauthorized,
} from 'src/common/swagger/decorators.swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @SwaggerOperation('Authenticate user and return access token')
  @SwaggerUnauthorized('Invalid credentials')
  @SwaggerInternalServerError()
  public async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(dto);
    return LoginResponseDto.create(token);
  }
}
