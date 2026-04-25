import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CredentialService } from './credential.service';
import { JwtServiceImplementation } from './implementations/jwt.service';
import { JwtStrategyImplementation } from './implementations/jwt.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          audience: configService.getOrThrow<string>('JWT_AUDIENCE'),
          issuer: configService.getOrThrow<string>('JWT_ISSUER'),
          expiresIn: parseInt(configService.getOrThrow<string>('JWT_TTL')),
        },
      }),
    }),
    PassportModule,
  ],
  providers: [
    {
      provide: CredentialService,
      useClass: JwtServiceImplementation,
    },
    JwtStrategyImplementation,
  ],
  exports: [CredentialService],
})
export class CredentialModule {}
