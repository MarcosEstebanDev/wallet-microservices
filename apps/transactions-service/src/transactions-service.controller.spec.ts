import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsServiceController } from './transactions-service.controller';
import { TransactionsServiceService } from './transactions-service.service';

describe('TransactionsServiceController', () => {
  let transactionsServiceController: TransactionsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsServiceController],
      providers: [TransactionsServiceService],
    }).compile();

    transactionsServiceController = app.get<TransactionsServiceController>(TransactionsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
