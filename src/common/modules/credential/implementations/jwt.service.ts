import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialService } from '../credential.service';

@Injectable()
export class JwtServiceImplementation implements CredentialService {
  constructor(private readonly jwtService: JwtService) {}

  public sign<T extends object>(payload: T): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
