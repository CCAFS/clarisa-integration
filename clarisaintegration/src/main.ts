import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Import the necessary modules
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: Logger = new Logger('Bootstrap');
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); // add application port environment variable
  await app
    .listen(port)
    .then(() => {
      logger.debug(`Application is running http://localhost:${port}`);
      logger.debug(`Documentation is running http://localhost:${port}/swagger`);
    })
    .catch((err) => {
      const portValue: number | string = port || '<Not defined>';
      logger.error(`Application failed to start on port ${portValue}`);
      logger.error(err);
    });
}
bootstrap();
