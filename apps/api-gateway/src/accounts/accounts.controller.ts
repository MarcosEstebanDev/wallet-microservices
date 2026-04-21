import { Controller, Get, Inject, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsNumber, IsPositive } from 'class-validator';

class DepositDto {
  @IsNumber() @IsPositive()
  amount: number;
}

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(@Inject('NATS_CLIENT') private readonly nats: ClientProxy) {}

  @Post()
  create(@Request() req) {
    return firstValueFrom(
      this.nats.send('account.create', { userId: req.user.sub }),
    );
  }

  @Get('balance')
  getBalance(@Request() req) {
    return firstValueFrom(this.nats.send('account.getBalance', req.user.sub));
  }

  @Post('deposit')
  deposit(@Request() req, @Body() dto: DepositDto) {
    return firstValueFrom(
      this.nats.send('account.updateBalance', {
        userId: req.user.sub,
        amount: dto.amount,
        operation: 'credit',
      }),
    );
  }
}
