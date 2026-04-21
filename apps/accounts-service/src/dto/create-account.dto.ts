import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Currency } from '../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  userId: string;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;
}
