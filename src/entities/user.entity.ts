import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // s в конце в названий таблицы руками не добавляется
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
}
