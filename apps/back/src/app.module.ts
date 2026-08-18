import { Module } from "@nestjs/common";
import { EvlogModule } from "evlog/nestjs";
import { ThrottlerModule } from "@nestjs/throttler";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { RedisModule } from "./redis/redis.module";
import { HealthModule } from "./health/health.module";
import configuration from "./config/configuration";
import mikroOrmConfig from "./mikro-orm.config";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    EvlogModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: 60_000,
        limit: 100,
      },
    ]),
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      driver: PostgreSqlDriver,
    }),
    RedisModule,
    UserModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
