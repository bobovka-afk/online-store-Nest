import { IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['generated', 'completed', 'cancelled'])
  status: string;
}
