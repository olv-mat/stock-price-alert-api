import { Controller, Get, Param } from '@nestjs/common';
import { UuidDto } from 'src/common/dtos/uuid.dto';
import {
  SwaggerInternalServerError,
  SwaggerNotFound,
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

  @Get(':id')
  @SwaggerOperation('Retrieve a specific user')
  @SwaggerNotFound('User not found')
  @SwaggerInternalServerError()
  public async findOne(@Param() { id }: UuidDto): Promise<UserResponseDto> {
    const userEntity = await this.userService.findOne(id);
    return UserResponseDto.fromEntity(userEntity);
  }
}
