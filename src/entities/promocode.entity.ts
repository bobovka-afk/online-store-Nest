import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PromoCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column('int')
  discountPercent: number;

  @Column({ default: true })
  isActive: boolean;
}
