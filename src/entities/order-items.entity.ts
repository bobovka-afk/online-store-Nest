import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './orders.entity';
import { Products } from './products.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Products, (product) => product.orderItems)
  product: Products;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price_at_order_time: number;
}
