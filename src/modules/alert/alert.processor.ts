import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, NotFoundException } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { EmailService } from 'src/common/modules/email/email.service';
import { StockService } from 'src/common/modules/stock/stock.service';
import { AlertService } from './alert.service';
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
      this.logger.debug('Starting alert processing...');
      const { owner, reference } = job.data;
      const { id, ticker, targetPrice } = await this.alertService.findOne(
        owner,
        reference,
      );

      this.logger.debug(`Fetching price for ${ticker}...`);
      const price = await this.stockService.getCurrentPrice(ticker);
      const hit = this.assertTargetHit(price, targetPrice);
      if (hit) {
        this.logger.debug('Sending notification...');
        await this.emailService.send(
          'Stock Alert Triggered',
          `${ticker} has reached your configured target price of ${targetPrice}`,
        );
        await this.alertService.complete(id);
        await this.remove(job);
        this.logger.debug(`All done, alert finished`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.remove(job);
        this.logger.error('Alert not found, job removed');
      }
    }
  }

  private assertTargetHit(
    price: number | undefined,
    targetPrice: number,
  ): boolean {
    if (!price) {
      this.logger.warn('Unable to retrieve the price at the moment');
      return false;
    }
    this.logger.debug(`Price now is ${price}, target is ${targetPrice}`);
    if (price > targetPrice) {
      this.logger.warn(`Price is still above target`);
      return false;
    }
    this.logger.log(`Target hit`);
    return true;
  }

  private async remove(job: Job<AlertJob>): Promise<void> {
    const key = job.repeatJobKey;
    if (key) await this.queue.removeRepeatableByKey(key);
  }
}
