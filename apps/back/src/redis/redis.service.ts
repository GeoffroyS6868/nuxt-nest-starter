import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as Redis from "ioredis";
import { env } from "process";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis.Redis;

  onModuleInit() {
    this.client = new Redis.Redis({
      host: env.REDIS_HOST || "localhost",
      port: parseInt(env.REDIS_PORT || "6380", 10),
      password: env.REDIS_PASSWORD || undefined,
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async set(key: string, value: string, ttlInSeconds: number): Promise<void> {
    await this.client.set(key, value, "EX", ttlInSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }
}
