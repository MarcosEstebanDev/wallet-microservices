import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.ARS })
  currency: Currency;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
