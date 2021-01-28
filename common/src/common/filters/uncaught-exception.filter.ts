import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { EMPTY } from 'rxjs';
import { parseContext } from '../utils';

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const { request, response, contextType } = parseContext(host);
    const statusCode = exception.status || 500;
    const message = exception.message || 'Internal Server Error';

    if (contextType === 'http') {
      response.status(statusCode).json({
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      return EMPTY;
    }
  }
}
