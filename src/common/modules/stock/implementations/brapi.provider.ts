import { ConfigService } from '@nestjs/config';
import Brapi from 'brapi';

export const BRAPI_CLIENT = 'BRAPI_CLIENT';
export const BrapiProvider = {
  provide: BRAPI_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Brapi({
      apiKey: configService.getOrThrow<string>('BRAPI_API_KEY'),
    });
  },
};
