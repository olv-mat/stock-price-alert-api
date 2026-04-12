import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export function setupSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Stock Price Alert API')
      .setDescription(
        'A NestJS stock price alert API. It allows users to set alerts for specific tickers and leverages BullMQ queues for efficient background processing, triggering email notifications when target prices are reached.',
      )
      .setVersion('1.0')
      .build(),
  );
  const theme = new SwaggerTheme();
  SwaggerModule.setup('/api', app, document, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
