import { Injectable, OnModuleInit } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  DNSHealthIndicator,
  HealthIndicatorFunction,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from '../redis/redis.health';

@Injectable()
export class HealthCheckRegistryService implements OnModuleInit {
  private _healthIndicatorFunctions: HealthIndicatorFunction[] = [];
  get healthIndicatorFunctions(): HealthIndicatorFunction[] {
    return this._healthIndicatorFunctions;
  }

  constructor(
    private readonly dns: DNSHealthIndicator,
    private readonly micoservice: MicroserviceHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  registerIndicatorFunction(
    fn: HealthIndicatorFunction | HealthIndicatorFunction[],
  ) {
    const fnArray = Array.isArray(fn) ? fn : [fn];
    this._healthIndicatorFunctions.push(...fnArray);
  }

  async onModuleInit() {
    this.registerIndicatorFunction([
      async () => this.dns.pingCheck('internet_allowed', 'https://google.com'),
      async () =>
        this.micoservice.pingCheck('rabbit_mq', {
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq:rabbitmq@127.0.0.1:5672'],
          },
        }),
      async () => this.redis.isHealthy('redis'),
    ]);
  }
}
