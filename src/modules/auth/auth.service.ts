import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';
import { CredentialService } from 'src/common/modules/credential/credential.service';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';

type AuthResult = {
  userEntity: UserEntity;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public async register(dto: CreateUserDto): Promise<AuthResult> {
    const userEntity = await this.userService.create(dto);
    return this.sign(userEntity);
  }

  public async login(dto: LoginDto): Promise<AuthResult> {
    const userEntity = await this.userService.findByEmail(dto.email);
    if (
      !userEntity ||
      !(await this.cryptographyService.compare(
        dto.password,
        userEntity?.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.sign(userEntity);
  }

  private async sign(entity: UserEntity): Promise<AuthResult> {
    const payload = {
      sub: entity.id,
      name: entity.name,
      email: entity.email,
    };
    const token =
      await this.credentialService.sign<AccessTokenPayload>(payload);
    return {
      userEntity: entity,
      token: token,
    };
  }
}
