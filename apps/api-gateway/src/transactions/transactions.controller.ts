import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(@Inject('NATS_CLIENT') private readonly nats: ClientProxy) {}

  @Post('transfer')
  transfer(
    @Request() req,
    @Body() body: { receiverId: string; amount: number; description?: string },
  ) {
    return firstValueFrom(
      this.nats.send('transaction.transfer', {
        senderId: req.user.sub,
        ...body,
      }),
    );
  }

  @Get('history')
  getHistory(@Request() req) {
    return firstValueFrom(
      this.nats.send('transaction.history', req.user.sub),
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return firstValueFrom(this.nats.send('transaction.getById', id));
  }
}
