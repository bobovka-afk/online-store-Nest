import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity';
import { OrderItem } from './order-items.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: 'generated' | 'completed' | 'cancelled';

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  deliveryDate: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user: User) => user.orders)
  user: User;
}
