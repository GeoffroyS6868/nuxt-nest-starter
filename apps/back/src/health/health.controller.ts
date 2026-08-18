import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

@Controller("health")
export class HealthController {
  constructor(private readonly redis: RedisService) {}

  @Get()
  async check() {
    try {
      await this.redis.ping();
      return { status: "ok" };
    } catch {
      throw new ServiceUnavailableException("Redis is unavailable");
    }
  }
}
