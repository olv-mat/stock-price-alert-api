import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';
import { CredentialService } from 'src/common/modules/credential/credential.service';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  public async login(dto: LoginDto): Promise<string> {
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
    return this.credentialService.sign<AccessTokenPayload>({
      sub: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
    });
  }
}
