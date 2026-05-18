import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { EmailService } from '../email.service';
import { EmailNotificationException } from '../exceptions/email-notification.exception';

interface EmailDeliveryResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class EmailDeliveryImplementation implements EmailService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async send(subject: string, text: string): Promise<void> {
    try {
      const url = this.configService.getOrThrow<string>('EMAIL_DELIVERY_URL');
      const token = this.configService.getOrThrow<string>(
        'EMAIL_DELIVERY_TOKEN',
      );
      const body = {
        subject: subject,
        text: text,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await firstValueFrom(
        this.httpService.post<EmailDeliveryResponse>(url, body, {
          headers: headers,
        }),
      );
    } catch {
      throw new EmailNotificationException();
    }
  }
}
