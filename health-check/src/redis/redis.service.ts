import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  async ping(): Promise<string> {
    return 'OK';
  }
}
