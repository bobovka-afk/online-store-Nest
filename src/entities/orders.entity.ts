import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { OrderItem } from './order-items.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.orders)
  user: User;

  @Column('decimal')
  total_price: number;

  @Column()
  status: 'paid' | 'completed' | 'cancelled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  orderItems: OrderItem[];
}
