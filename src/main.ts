import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import fastifyStatic from '@fastify/static';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GenericExceptionFilter } from './_util/filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      routerOptions: {
        ignoreTrailingSlash: true,
      },
    }),
    { bufferLogs: true },
  );

  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.enableCors();
  app.useGlobalFilters(new GenericExceptionFilter());

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRoute', (opts) => {
      if (opts.path === '/healthcheck') opts.logLevel = 'silent';
    });

  const docsConfig = new DocumentBuilder()
    .setTitle('Movie Management API')
    .setDescription('Movie Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000, '0.0.0.0');
}

bootstrap().catch((err) =>
  console.error(`Error starting: ${err.message}`, err),
);
