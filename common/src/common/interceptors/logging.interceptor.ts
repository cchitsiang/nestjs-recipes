import * as _ from 'lodash';
import * as MaskJson from 'mask-json';
import * as Stringify from 'json-stringify-safe';
import { Request, Response } from 'express';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
  private readonly mask = MaskJson(['password'], {
    ignoreCase: true,
    replacement: '********',
  });
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();

    this.logIncomingRequest(request);

    return next.handle().pipe(
      tap((data) => {
        this.logServerResponse(request, response, {
          body: data,
        });
      }),
    );
  }

  logIncomingRequest(request: Request) {
    // TODO: Add your own logger implementation here
    const requestUser: { id: string } = (request as any).user;
    this.logger.log(
      `Incoming Request: ${new Date().toUTCString()} - Method: ${
        request.method
      } Url: ${request.originalUrl || request.url} HTTP/${
        request.httpVersion
      } - Address: ${request.ip} - Agent: ${request.get(
        'user-agent',
      )} - UserId: ${_.get(
        requestUser,
        'user.id',
        'Unknown User',
      )} - Request: ${Stringify({ body: this.mask(request.body) })}`,
    );
  }

  logServerResponse(request: Request, response: Response, data?: any) {
    // TODO: Add your own logger implementation here
    const requestUser: { id: string } = (request as any).user;
    this.logger.log(
      `Server Response: ${new Date().toUTCString()} - Method: ${
        request.method
      } Url: ${request.originalUrl || request.url} HTTP/${
        request.httpVersion
      } - Address: ${request.ip} - Agent: ${request.get(
        'user-agent',
      )} - UserId: ${_.get(
        requestUser,
        'user.id',
        'Unknown User',
      )} - Response: ${Stringify(this.mask(data))} - Status: ${
        data.status || response.statusCode
      }`,
    );
  }
}
