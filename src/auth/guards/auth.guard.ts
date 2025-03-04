import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('Токен не предоставлен');
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
      throw new UnauthorizedException('Токен отсутствует');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      // проверяем в базе есть ли такой пользователь
      request.user = decoded; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Неверный токен');
    }
  }
}
