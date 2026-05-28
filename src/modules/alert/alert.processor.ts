import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { EmailService } from 'src/common/modules/email/email.service';
import { StockNotFoundException } from 'src/common/modules/stock/exceptions/stock-not-found.exception';
import { StockService } from 'src/common/modules/stock/stock.service';
import { AlertService } from './alert.service';
import { AlertEntity } from './entities/alert.entity';
import { AlertStatus } from './enums/alert-status.enum';
import { AlertNotFoundException } from './exceptions/alert-not-found.exception';
import { AlertJob } from './types/alert-job.type';

@Processor('alerts', {
  concurrency: Number(process.env.CONCURRENCY ?? 1),
})
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

  public async process(job: Job<AlertJob>): Promise<void> {
    let alertEntity: AlertEntity | null = null;
    try {
      alertEntity = await this.getAlertByJob(job);
      const { id, ticker, targetPrice } = alertEntity;
      this.logger.log(`Processing started for ${ticker}`);
      const currentPrice = await this.stockService.getCurrentPrice(ticker);

      if (currentPrice === undefined) {
        this.logger.warn(`Unable to retrieve the price`);
        return;
      }

      this.logger.log(`Current price is ${currentPrice}`);
      this.logger.log(`Target price is ${targetPrice}`);

      if (currentPrice > targetPrice) {
        this.logger.warn('Price is still above target');
        return;
      }

      this.logger.log('Target price hit');
      await this.sendNotification(ticker, targetPrice);
      this.logger.log('Notification sent successfully');
      await this.alertService.updateStatus(id, AlertStatus.COMPLETED);
      await this.removeJob(job);
    } catch (error) {
      if (
        error instanceof AlertNotFoundException ||
        error instanceof StockNotFoundException
      ) {
        await this.removeJob(job);
      }

      if (error instanceof StockNotFoundException && alertEntity) {
        const { id } = alertEntity;
        await this.alertService.updateStatus(id, AlertStatus.FAILED);
      }

      if (error instanceof Error) {
        this.logger.error(error.message);
      }
    }
  }

  private async getAlertByJob(job: Job<AlertJob>): Promise<AlertEntity> {
    const { owner, reference } = job.data;
    return this.alertService.findOne(owner, reference);
  }

  private async sendNotification(
    ticker: string,
    targetPrice: number,
  ): Promise<void> {
    await this.emailService.send(
      'Stock Alert',
      `${ticker} has reached your configured target price of ${targetPrice}`,
    );
  }

  private async removeJob(job: Job<AlertJob>): Promise<void> {
    const key = job.repeatJobKey;
    if (key) await this.queue.removeRepeatableByKey(key);
  }
}
