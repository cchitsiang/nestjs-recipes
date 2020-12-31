import * as fs from 'fs';
import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setupSwagger(app: INestApplication) {
  const writeSwaggerJson = (path: string, document) => {
    fs.writeFileSync(`${path}/swagger.json`, JSON.stringify(document, null, 2), { encoding: 'utf8' });
  };

  const options = new DocumentBuilder()
    .setTitle('API')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });
  writeSwaggerJson(`${process.cwd()}`, document);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { displayOperationId: true },
  });
  app.use('/docs/swagger.json', (_, res) => {
    res.json(document);
  });
}

async function bootstrap() {
  const port = 3000;
  const apiBasePath = '/api';
  const app = await NestFactory.create(AppModule);

  if (apiBasePath) {
    app.setGlobalPrefix(apiBasePath);
  }

  setupSwagger(app);

  await app.listen(3000);

  Logger.log(`Swagger UI available at http://localhost:${port}/docs`);
  Logger.log(`Application is running on: http://localhost:${port}${apiBasePath}`);
}
bootstrap();
