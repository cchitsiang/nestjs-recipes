import { ContextType } from '@nestjs/common';
import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Parses in the Nest ExecutionContext of the incoming request, accounting for both
 * GraphQL & REST requests.
 */
export function parseContext(
  context: ExecutionContext | ArgumentsHost,
): { request: Request; response: Response; contextType: ContextType } {
  const request = context.switchToHttp().getRequest<Request>();
  const response = context.switchToHttp().getResponse<Response>();

  return {
    request,
    response,
    contextType: context.getType<ContextType>(),
  };
}

export const stripPhoneNumber = (phoneNumber: string): string => {
  phoneNumber = phoneNumber ? phoneNumber.trim() : phoneNumber;
  if (!phoneNumber) {
    return '';
  }

  while (phoneNumber[0] === '+') {
    phoneNumber = phoneNumber.slice(1);
  }

  // NOTE: this is for Malaysian number
  if (phoneNumber[0] === '0') {
    phoneNumber = '6' + phoneNumber;
  }

  return phoneNumber;
};
