import { NotFoundException } from '@nestjs/common';

export class AlertNotFoundException extends NotFoundException {
  constructor() {
    super('Alert not found');
  }
}
