import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/common/modules/email/email.module';
import { StockModule } from 'src/common/modules/stock/stock.module';
import { AlertController } from './alert.controller';
import { AlertProcessor } from './alert.processor';
import { AlertService } from './alert.service';
import { AlertEntity } from './entities/alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlertEntity]),
    BullModule.registerQueue({
      name: 'alerts',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    StockModule,
    EmailModule,
  ],
  controllers: [AlertController],
  providers: [AlertService, AlertProcessor],
})
export class AlertModule {}
