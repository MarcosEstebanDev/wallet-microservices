import { Body, Controller, Inject, Post, HttpCode } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject('NATS_CLIENT') private readonly nats: ClientProxy) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return firstValueFrom(this.nats.send('auth.register', body));
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: { email: string; password: string }) {
    return firstValueFrom(this.nats.send('auth.login', body));
  }
}
