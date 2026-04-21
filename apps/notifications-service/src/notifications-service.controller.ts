import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { TransactionCompletedEvent } from './events/transaction-completed.event';
import { NotificationsServiceService } from './notifications-service.service';

@Controller()
export class NotificationsServiceController {
  constructor(private readonly notificationsService: NotificationsServiceService) {}

  // EventPattern = async, fire-and-forget (no devuelve respuesta)
  @EventPattern('transaction.completed')
  handleTransactionCompleted(@Payload() event: TransactionCompletedEvent): void {
    this.notificationsService.notifyTransactionCompleted(event);
  }
}
