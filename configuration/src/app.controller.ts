import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { DatabaseConfig } from './config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('configurations')
  indexConfigurations() {
    const dbConfig = this.configService.get<DatabaseConfig>('db');
    return dbConfig;
  }
}
