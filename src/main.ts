import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GenericExceptionFilter } from './_util/filters';

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

  await app.listen(3000, '127.0.0.1');
}

bootstrap().catch((err) =>
  console.error(`Error starting: ${err.message}`, err),
);
