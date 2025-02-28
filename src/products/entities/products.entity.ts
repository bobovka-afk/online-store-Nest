import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description?: string;
}
