import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsServiceModule } from './notifications-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsServiceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
      },
    },
  );

  await app.listen();
  console.log('✅ Notifications service is listening on NATS');
}
bootstrap();
