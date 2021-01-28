import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisModule } from '../redis/redis.module';
import { HealthCheckRegistryService } from './health-check-registry.service';
import { HealthCheckController } from './health-check.controller';

@Module({
  imports: [TerminusModule, RedisModule],
  providers: [HealthCheckRegistryService],
  controllers: [HealthCheckController],
  exports: [HealthCheckRegistryService],
})
export class HealthCheckModule {}
