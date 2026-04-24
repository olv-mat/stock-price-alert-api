import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptographyService } from './cryptography.service';

@Injectable()
export class BcryptServiceImplementation extends CryptographyService {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
