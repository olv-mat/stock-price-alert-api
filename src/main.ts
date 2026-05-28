import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Environments } from './common/enums/environments.enum';
import { setupBullBoard } from './common/settings/bull/bull-board.setup';
import { setupSwagger } from './common/settings/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  setupBullBoard(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  if (process.env.NODE_ENV === Environments.PRODUCTION) {
    app.use(helmet());
    app.enableCors({});
  }
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
