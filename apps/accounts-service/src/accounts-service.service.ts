import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
