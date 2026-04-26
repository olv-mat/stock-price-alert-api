import { UserResponseDto } from 'src/modules/user/dtos/user-response.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class AuthResponseDto {
  public readonly user: UserResponseDto;
  public readonly token: string;

  private constructor(user: UserResponseDto, token: string) {
    this.user = user;
    this.token = token;
  }

  public static fromEntity(entity: UserEntity, token: string): AuthResponseDto {
    const dto = UserResponseDto.fromEntity(entity);
    return new AuthResponseDto(dto, token);
  }
}
