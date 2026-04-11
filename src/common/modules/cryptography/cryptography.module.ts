import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { CryptographyService } from './cryptography.service';

@Global()
@Module({
  providers: [{ provide: CryptographyService, useClass: BcryptService }],
  exports: [CryptographyService],
})
export class CryptographyModule {}
