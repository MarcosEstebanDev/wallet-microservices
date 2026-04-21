import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { TransactionsServiceModule } from './transactions-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransactionsServiceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen();
  console.log('✅ Transactions service is listening on NATS');
}
bootstrap();
