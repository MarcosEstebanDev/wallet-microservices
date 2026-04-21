import { Injectable, Logger } from '@nestjs/common';
import type { TransactionCompletedEvent } from './events/transaction-completed.event';

export type { TransactionCompletedEvent };

@Injectable()
export class NotificationsServiceService {
  private readonly logger = new Logger(NotificationsServiceService.name);

  notifyTransactionCompleted(event: TransactionCompletedEvent): void {
    this.logger.log(`📤 Notificando transacción completada:`);
    this.logger.log(`   ID:           ${event.transactionId}`);
    this.logger.log(`   Remitente:    ${event.senderId}`);
    this.logger.log(`   Destinatario: ${event.receiverId}`);
    this.logger.log(`   Monto:        ${event.amount} ${event.currency}`);

    this.sendToSender(event);
    this.sendToReceiver(event);
  }

  private sendToSender(event: TransactionCompletedEvent): void {
    this.logger.log(
      `✉️  [EMAIL → sender ${event.senderId}] Transferiste ${event.amount} ${event.currency} correctamente.`,
    );
  }

  private sendToReceiver(event: TransactionCompletedEvent): void {
    this.logger.log(
      `✉️  [EMAIL → receiver ${event.receiverId}] Recibiste ${event.amount} ${event.currency}.`,
    );
  }
}
