import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApplicationException } from './common/exceptions';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('bad-request')
  badRequest() {
    throw new BadRequestException('this is bad request exception');
  }

  @Get('uncaught-exception')
  uncaughtException() {
    throw new Error('this is internal server error');
  }

  @Get('application-exception')
  applicationException() {
    throw new ApplicationException(
      'this is user input error',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
