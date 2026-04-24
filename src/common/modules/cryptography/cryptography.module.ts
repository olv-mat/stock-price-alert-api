import { Global, Module } from '@nestjs/common';
import { BcryptServiceImplementation } from './bcrypt.service';
import { CryptographyService } from './cryptography.service';

@Global()
@Module({
  providers: [
    {
      provide: CryptographyService,
      useClass: BcryptServiceImplementation,
    },
  ],
  exports: [CryptographyService],
})
export class CryptographyModule {}
