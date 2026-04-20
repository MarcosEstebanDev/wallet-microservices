import { Test, TestingModule } from '@nestjs/testing';
import { AccountsServiceController } from './accounts-service.controller';
import { AccountsServiceService } from './accounts-service.service';

describe('AccountsServiceController', () => {
  let accountsServiceController: AccountsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountsServiceController],
      providers: [AccountsServiceService],
    }).compile();

    accountsServiceController = app.get<AccountsServiceController>(AccountsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accountsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
