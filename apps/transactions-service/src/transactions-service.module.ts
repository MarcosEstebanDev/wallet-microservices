import { Module } from '@nestjs/common';
import { TransactionsServiceController } from './transactions-service.controller';
import { TransactionsServiceService } from './transactions-service.service';

@Module({
  imports: [],
  controllers: [TransactionsServiceController],
  providers: [TransactionsServiceService],
})
export class TransactionsServiceModule {}
