import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptographyService } from './cryptography.service';

/* 
  npm i bcrypt
  npm i --D @types/bcrypt 
*/

@Injectable()
export class BcryptService extends CryptographyService {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
