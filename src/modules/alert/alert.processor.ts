import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { EmailService } from 'src/common/modules/email/email.service';
import { StockService } from 'src/common/modules/stock/stock.service';
import { AlertService } from './alert.service';
import { AlertNotFoundException } from './exceptions/alert-not-found.exception';
import { AlertJob } from './types/alert-job.type';

@Processor('alerts')
export class AlertProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertProcessor.name);

  constructor(
    @InjectQueue('alerts') private readonly queue: Queue,
    private readonly alertService: AlertService,
    private readonly stockService: StockService,
    private readonly emailService: EmailService,
  ) {
    super();
  }

  public async process(job: Job<AlertJob>): Promise<any> {
    try {
      this.logger.log('Starting alert processing...');
      const { owner, reference } = job.data;
      const { id, ticket, targetPrice } = await this.alertService.findOne(
        owner,
        reference,
      );

      this.logger.log(`Fetching price for ${ticket}...`);
      const price = await this.stockService.getCurrentPrice(ticket);
      this.logger.log(`Price now is ${price}, target is ${targetPrice}`);

      if (price > targetPrice) {
        this.logger.warn(`Not yet, price is still above target`);
        return;
      }

      this.logger.log(`Target hit for ${id}`);
      await this.alertService.complete(id);
      await this.remove(job);
      this.logger.log(`All done, alert ${id} finished`);
    } catch (error) {
      if (error instanceof AlertNotFoundException) {
        await this.remove(job);
        this.logger.error(
          'Alert not found, job removed and processing finished',
        );
      }
    }
  }

  private async remove(job: Job<AlertJob>): Promise<void> {
    const key = job.repeatJobKey;
    if (key) await this.queue.removeRepeatableByKey(key);
  }
}
