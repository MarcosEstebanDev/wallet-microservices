import { Module } from '@nestjs/common';
import { AccountsServiceController } from './accounts-service.controller';
import { AccountsServiceService } from './accounts-service.service';

@Module({
  imports: [],
  controllers: [AccountsServiceController],
  providers: [AccountsServiceService],
})
export class AccountsServiceModule {}
