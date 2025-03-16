import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToOne(() => Cart, (cart: Cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Order, (order: Order) => order.user)
  orders: Order[];
}
