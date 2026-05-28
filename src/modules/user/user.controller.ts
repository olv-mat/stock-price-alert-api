import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FromRequest } from 'src/common/decorators/from-request.decorator';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';
import { AtLeastOneFieldPipe } from 'src/common/pipes/at-least-one-field.pipe';
import {
  SwaggerBadRequest,
  SwaggerBearerAuth,
  SwaggerConflict,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOperation,
  SwaggerUnauthorized,
} from 'src/common/settings/swagger/swagger.decorators';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
@SwaggerBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @SwaggerOperation('Retrieve the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('User not found')
  @SwaggerInternalServerError()
  public async find(
    @FromRequest('user') user: AccessTokenPayload,
  ): Promise<UserResponseDto> {
    const userEntity = await this.userService.find(user.sub);
    return UserResponseDto.fromEntity(userEntity);
  }

  @Patch('/me')
  @SwaggerOperation('Update the current user')
  @SwaggerBadRequest('At least one field must be provided')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('User not found')
  @SwaggerConflict('Email already in use')
  @SwaggerInternalServerError()
  public async update(
    @FromRequest('user') user: AccessTokenPayload,
    @Body(new AtLeastOneFieldPipe()) dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    await this.userService.update(user.sub, dto);
    return DefaultResponseDto.create(
      'Your account has been updated successfully',
    );
  }

  @Delete('/me')
  @SwaggerOperation('Delete the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('User not found')
  @SwaggerInternalServerError()
  public async delete(
    @FromRequest('user') user: AccessTokenPayload,
  ): Promise<DefaultResponseDto> {
    await this.userService.delete(user.sub);
    return DefaultResponseDto.create(
      'Your account has been deleted successfully',
    );
  }
}
