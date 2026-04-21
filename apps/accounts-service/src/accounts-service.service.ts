import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class AccountsServiceService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
    const existing = await this.accountRepository.findOne({
      where: { userId: dto.userId },
    });
    if (existing) throw new Error('Account already exists for this user');

    const account = this.accountRepository.create(dto);
    return this.accountRepository.save(account);
  }

  async getByUserId(userId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { userId, active: true },
    });
    if (!account) throw new Error(`Account not found for user ${userId}`);
    return account;
  }

  async updateBalance(dto: UpdateBalanceDto): Promise<Account> {
    const account = await this.getByUserId(dto.userId);

    const current = Number(account.balance);

    if (dto.operation === 'debit') {
      if (current < dto.amount) throw new Error('Insufficient funds');
      account.balance = current - dto.amount;
    } else {
      account.balance = current + dto.amount;
    }

    return this.accountRepository.save(account);
  }
}
