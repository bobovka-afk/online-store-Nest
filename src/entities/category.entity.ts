import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('category')
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Product, (product: Product) => product.categories)
  products: Product[];
}
