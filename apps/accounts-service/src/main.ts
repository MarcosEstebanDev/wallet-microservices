import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AccountsServiceModule } from './accounts-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountsServiceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen();
  console.log('✅ Accounts service is listening on NATS');
}
bootstrap();
