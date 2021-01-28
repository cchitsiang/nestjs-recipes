import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ApplicationException extends BaseException {
  constructor(
    response: string | Record<string, unknown>,
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: Error,
  ) {
    super(response, status, error);
  }
}
