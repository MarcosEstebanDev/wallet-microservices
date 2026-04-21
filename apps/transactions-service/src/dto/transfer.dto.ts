import { IsString, IsNumber, IsPositive, IsOptional, Min } from 'class-validator';

export class TransferDto {
  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
