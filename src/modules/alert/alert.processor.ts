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
    const data = job.data;
    const price = await this.stockService.getCurrentPrice(data.ticket);
    if (price <= data.targetPrice) {
      if (job.repeatJobKey) {
        await this.queue.removeRepeatableByKey(job.repeatJobKey);
        await this.alertService.complete(data.id);
      }
    }
    this.logger.debug(price, data.targetPrice, price <= data.targetPrice);
  }
}
