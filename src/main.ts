import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import { AppExcepationFilter } from './common/filters/app-excepation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.use(express.static(path.join(__dirname, '..',"uploads")));
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform:true,
      transformOptions:{
        enableImplicitConversion:true
      }
    },
  ));
  app.useGlobalFilters(new AppExcepationFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
