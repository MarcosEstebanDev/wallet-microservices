import { Controller, Get } from '@nestjs/common';
import { AccountsServiceService } from './accounts-service.service';

@Controller()
export class AccountsServiceController {
  constructor(private readonly accountsServiceService: AccountsServiceService) {}

  @Get()
  getHello(): string {
    return this.accountsServiceService.getHello();
  }
}
