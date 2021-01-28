import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  customResponse: {
    [key: string]: any;
  };

  error: Error;

  constructor(
    response: string | Record<string, unknown>,
    status: number,
    error?: Error,
  ) {
    super(response, status);
    this.error = error;
  }
}
