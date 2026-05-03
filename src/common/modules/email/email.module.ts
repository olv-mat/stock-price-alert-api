import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDeliveryImplementation } from './implementations/email-delivery.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: EmailService,
      useClass: EmailDeliveryImplementation,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
