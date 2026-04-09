import { Controller, Get } from '@nestjs/common';
import {
  SwaggerInternalServerError,
  SwaggerOperation,
} from 'src/common/swagger/decorators.swagger';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SwaggerOperation('Retrieve all users')
  @SwaggerInternalServerError()
  public async findAll(): Promise<UserResponseDto[]> {
    const userEntities = await this.userService.findAll();
    return UserResponseDto.fromEntities(userEntities);
  }
}
