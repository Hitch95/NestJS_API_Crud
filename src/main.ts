import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['esgi'],
    }),
  );

  await app.listen(3000);
  displayRoutes(app);
}

function displayRoutes(app: INestApplication) {
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route.path,
            method: layer.route.stack[0].method,
          },
        };
      }
    })
    .filter((route: unknown) => route !== undefined);

  console.log(availableRoutes);
}

bootstrap();
