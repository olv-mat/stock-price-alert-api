import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { AlertEntity } from './entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertEntity])],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
