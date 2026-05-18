import { InternalServerErrorException } from '@nestjs/common';

export class EmailNotificationException extends InternalServerErrorException {
  constructor() {
    super('Failed to send email notification');
  }
}
