import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsServiceService } from './transactions-service.service';
import { TransferDto } from './dto/transfer.dto';

@Controller()
export class TransactionsServiceController {
  constructor(private readonly transactionsService: TransactionsServiceService) {}

  @MessagePattern('transaction.transfer')
  transfer(@Payload() dto: TransferDto) {
    return this.transactionsService.transfer(dto);
  }

  @MessagePattern('transaction.history')
  getHistory(@Payload() userId: string) {
    return this.transactionsService.getHistory(userId);
  }

  @MessagePattern('transaction.getById')
  getById(@Payload() id: string) {
    return this.transactionsService.getById(id);
  }
}
