import { PipeTransform, Injectable } from '@nestjs/common';
import { set, get } from 'lodash';
import { stripPhoneNumber } from '../utils';

@Injectable()
export class ParsePhoneNumberPipe implements PipeTransform<any, any> {
  private keysToPhoneNumber: string[] = [];
  constructor(keysToPhoneNumber: string | string[]) {
    if (!keysToPhoneNumber) {
      return;
    }
    this.keysToPhoneNumber = this.keysToPhoneNumber?.concat(keysToPhoneNumber);
  }

  transform(dto: any): any {
    this.keysToPhoneNumber.forEach(
      (k) => get(dto, k) && set(dto, k, stripPhoneNumber(get(dto, k))),
    );
    return dto;
  }
}
