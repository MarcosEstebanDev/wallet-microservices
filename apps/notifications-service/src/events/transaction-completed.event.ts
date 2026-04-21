export interface TransactionCompletedEvent {
  transactionId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: string;
}
