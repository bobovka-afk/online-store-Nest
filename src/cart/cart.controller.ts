import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Cart } from '../entities/cart.entity';

interface AuthenticatedRequest extends Request {
  user: { id: number }; // Добавляем тип для user
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<Cart> {
    const userId = req.user.id; // Теперь TypeScript знает, что req.user существует и имеет id
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  async getCart(@Req() req: AuthenticatedRequest): Promise<Cart> {
    const userId = req.user.id;
    return this.cartService.getCart(userId);
  }

  @Delete('remove')
  async removeFromCart(
    @Req() req: AuthenticatedRequest,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ): Promise<boolean> {
    const userId = req.user.id;
    return this.cartService.removeFromCart(userId, removeFromCartDto);
  }
}
