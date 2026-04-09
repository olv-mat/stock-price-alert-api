import { UserEntity } from '../entities/user.entity';

type UserResponseProperties = {
  id: string;
  name: string;
  email: string;
};

export class UserResponseDto {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;

  private constructor(properties: UserResponseProperties) {
    this.id = properties.id;
    this.name = properties.name;
    this.email = properties.email;
  }

  public static fromEntities(entities: UserEntity[]): UserResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }

  public static fromEntity(entity: UserEntity): UserResponseDto {
    return new UserResponseDto({
      id: entity.id,
      name: entity.name,
      email: entity.email,
    });
  }
}
