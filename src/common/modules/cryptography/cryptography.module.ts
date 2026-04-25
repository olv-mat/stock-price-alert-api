import { Global, Module } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { BcryptServiceImplementation } from './implementations/bcrypt.service';

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
