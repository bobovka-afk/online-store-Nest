import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './orders.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Product, (product: Product) => product.orderItems)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price_at_order_time: number;
}
