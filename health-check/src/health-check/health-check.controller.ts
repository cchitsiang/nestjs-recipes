import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckRegistryService } from './health-check-registry.service';

@Controller('health')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private healthCheckRegistryService: HealthCheckRegistryService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check(
      this.healthCheckRegistryService.healthIndicatorFunctions,
    );
  }
}
