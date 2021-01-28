import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from './redis.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sleep = require('util').promisify(setTimeout);

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const pong = await Promise.race([this.redisService.ping(), sleep(1000)]);

    const result = this.getStatus(key, pong);
    if (pong) {
      return result;
    }

    throw new HealthCheckError('Redis health check failed', result);
  }
}
