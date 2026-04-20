import { NestFactory } from '@nestjs/core';
import { AccountsServiceModule } from './accounts-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AccountsServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
