import { NestFactory } from '@nestjs/core';
import { TransactionsServiceModule } from './transactions-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
