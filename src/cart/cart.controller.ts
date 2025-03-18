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
import { AddToCartDto } from './dto/addToCart.dto';
import { RemoveFromCartDto } from './dto/removeFromCart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Cart } from '../entities/cart.entity';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<boolean> {
    const userId = req.user.id;
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

  @Delete('clear')
  async clearCart(@Req() req: AuthenticatedRequest): Promise<boolean> {
    const userId = req.user.id;
    return this.cartService.clearCart(userId);
  }
}
