import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';

@Injectable()
export class JwtStrategyImplementation extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
      issuer: configService.getOrThrow<string>('JWT_ISSUER'),
    });
  }

  public validate(payload: AccessTokenPayload): AccessTokenPayload {
    return payload;
  }
}
