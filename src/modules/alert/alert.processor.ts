import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
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
    private readonly stockService: StockService,
    private readonly emailService: EmailService,
    private readonly alertService: AlertService,
  ) {
    super();
  }

  public async process(job: Job<AlertJob>): Promise<any> {
    try {
      this.logger.debug('Starting alert processing...');
      const { owner, reference } = job.data;
      const alertEntity = await this.alertService.findOne(owner, reference);
      this.logger.debug(`Looking at ${alertEntity.ticket}...`);
      const price = await this.stockService.getCurrentPrice(alertEntity.ticket);
      this.logger.debug(
        `Price now is ${price}, target is ${alertEntity.targetPrice}`,
      );
      if (price <= alertEntity.targetPrice) {
        this.logger.debug(`Target hit for ${alertEntity.ticket}`);
        await this.alertService.complete(alertEntity.id);
        await this.remove(job);
        this.logger.debug(`All done, alert ${reference} finished`);
      } else {
        this.logger.warn(
          `Not yet, ${alertEntity.ticket} is still above target`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
    }
  }

  private async remove(job: Job<AlertJob>): Promise<void> {
    const key = job.repeatJobKey;
    if (key) await this.queue.removeRepeatableByKey(key);
  }
}
