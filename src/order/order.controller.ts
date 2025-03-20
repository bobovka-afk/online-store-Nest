import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { CreateOrderDto } from './dto/createOrder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderResponseDto } from './dto/orderResponse.dto';
import { ApiTags } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';

@ApiTags('order')
@Controller('order')
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

  @Get('list')
  async orderList(@Req() req: AuthenticatedRequest): Promise<Order[]> {
    const userId = req.user.id;
    return await this.orderService.orderList(userId);
  }

  @Patch(':id')
  @Roles(ERole.ADMIN)
  async updateOrderStatus(
    @Param('id') orderId: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
  }
}
