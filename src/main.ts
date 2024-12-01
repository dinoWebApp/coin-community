import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('isGreater', function (a, b, options) {
    return a > b ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('isEqual', function (a, b, options) {
    return a == b ? options.fn(this) : '';
  });
  hbs.registerHelper('repeat', function (count, options) {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += options.fn(i + 1); // i + 1: 1부터 시작
    }
    return result;
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
