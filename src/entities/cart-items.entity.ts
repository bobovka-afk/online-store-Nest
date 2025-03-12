import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart: Cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product: Product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
