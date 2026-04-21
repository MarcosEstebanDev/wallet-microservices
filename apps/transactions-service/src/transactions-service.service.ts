import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Transaction, TransactionStatus, TransactionType } from './entities/transaction.entity';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsServiceService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) {}

  async transfer(dto: TransferDto): Promise<Transaction> {
    if (dto.senderId === dto.receiverId) {
      throw new Error('Sender and receiver cannot be the same');
    }

    // Persiste la transacción en estado PENDING
    const transaction = await this.transactionRepository.save(
      this.transactionRepository.create({
        ...dto,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
      }),
    );

    try {
      // 1. Debita al remitente
      await firstValueFrom(
        this.natsClient.send('account.updateBalance', {
          userId: dto.senderId,
          amount: dto.amount,
          operation: 'debit',
        }),
      );

      // 2. Acredita al destinatario
      await firstValueFrom(
        this.natsClient.send('account.updateBalance', {
          userId: dto.receiverId,
          amount: dto.amount,
          operation: 'credit',
        }),
      );

      // 3. Marca como completada
      transaction.status = TransactionStatus.COMPLETED;
      await this.transactionRepository.save(transaction);

      // 4. Emite evento async para notifications (fire-and-forget)
      this.natsClient.emit('transaction.completed', {
        transactionId: transaction.id,
        senderId: dto.senderId,
        receiverId: dto.receiverId,
        amount: dto.amount,
        currency: transaction.currency,
      });

      return transaction;
    } catch (error) {
      // Rollback: revierte el débito si el crédito falló
      transaction.status = TransactionStatus.FAILED;
      transaction.failureReason = error.message;
      await this.transactionRepository.save(transaction);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  async getHistory(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<Transaction> {
    const tx = await this.transactionRepository.findOne({ where: { id } });
    if (!tx) throw new Error(`Transaction ${id} not found`);
    return tx;
  }
}
