import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountsServiceService } from './accounts-service.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller()
export class AccountsServiceController {
  constructor(private readonly accountsService: AccountsServiceService) {}

  @MessagePattern('account.create')
  create(@Payload() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }

  @MessagePattern('account.getBalance')
  getBalance(@Payload() userId: string) {
    return this.accountsService.getByUserId(userId);
  }

  @MessagePattern('account.updateBalance')
  updateBalance(@Payload() dto: UpdateBalanceDto) {
    return this.accountsService.updateBalance(dto);
  }
}
