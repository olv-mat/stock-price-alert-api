import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { UuidDto } from 'src/common/dtos/uuid.dto';
import { AtLeastOneFieldPipe } from 'src/common/pipes/at-least-one-field.pipe';
import {
  SwaggerConflict,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOperation,
} from 'src/common/swagger/decorators.swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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

  @Post()
  @SwaggerOperation('Create a new user')
  @SwaggerConflict('Email already in use')
  @SwaggerInternalServerError()
  public async create(@Body() dto: CreateUserDto): Promise<CreatedResponseDto> {
    const { id } = await this.userService.create(dto);
    return CreatedResponseDto.create(id, 'User created successfully');
  }

  @Patch(':id')
  public async update(
    @Param() { id }: UuidDto,
    @Body(new AtLeastOneFieldPipe()) dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    await this.userService.update(id, dto);
    return DefaultResponseDto.create('User updated successfully');
  }
}
