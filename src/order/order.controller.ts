import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { CreateOrderDto } from './dto/createOrder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderResponseDto } from './dto/orderResponse.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const userId = req.user.id;
    const order = await this.orderService.createOrder(userId, createOrderDto);

    return {
      id: order.id,
      status: order.status,
      phoneNumber: order.phoneNumber,
      address: order.address,
      deliveryDate: order.deliveryDate,
      totalPrice: order.totalPrice,
    };
  }
}
