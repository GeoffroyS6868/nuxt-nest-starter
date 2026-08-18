import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { initLogger } from "evlog";
import { AppModule } from "./app.module";
import { resolveCorsOrigins } from "./common/environment/cors-origins";
import { getFrontUrl } from "./common/environment/secrets";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

const isProduction = process.env.NODE_ENV === "production";

initLogger({
  env: { service: "starter-back" },
  ...(isProduction
    ? {
        sampling: {
          rates: {
            info: 5,
            warn: 50,
            debug: 0,
            error: 100,
          },
          keep: [{ duration: 1000 }, { status: 400 }],
        },
      }
    : {}),
});

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: resolveCorsOrigins({
      isProduction,
      frontUrl: getFrontUrl(),
      extraOrigins: process.env.CORS_ORIGINS ?? "",
    }),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
  await app.register(cookie);

  const port = process.env.PORT ?? 4001;

  await app.listen(port, "0.0.0.0");
}

bootstrap();
