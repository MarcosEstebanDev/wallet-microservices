import { Controller, Get } from '@nestjs/common';
import { TransactionsServiceService } from './transactions-service.service';

@Controller()
export class TransactionsServiceController {
  constructor(private readonly transactionsServiceService: TransactionsServiceService) {}

  @Get()
  getHello(): string {
    return this.transactionsServiceService.getHello();
  }
}
