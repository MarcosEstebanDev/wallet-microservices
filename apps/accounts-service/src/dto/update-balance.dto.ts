import { IsString, IsNumber, IsPositive, IsIn } from 'class-validator';

export class UpdateBalanceDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn(['credit', 'debit'])
  operation: 'credit' | 'debit';
}
