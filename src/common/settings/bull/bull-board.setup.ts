import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bullmq';
import { INestApplication } from '@nestjs/common';
import { Queue } from 'bullmq';

export function setupBullBoard(app: INestApplication): void {
  const alertsQueue = app.get<Queue>(getQueueToken('alerts'));
  const adapter = new ExpressAdapter();
  adapter.setBasePath('/admin/queues');
  createBullBoard({
    queues: [new BullMQAdapter(alertsQueue)],
    serverAdapter: adapter,
  });
  app.use('/admin/queues', adapter.getRouter());
}
