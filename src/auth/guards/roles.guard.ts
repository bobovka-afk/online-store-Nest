import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ERole } from '../enums/roles.enum';
import { AuthService } from 'auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

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
      const decoded = await this.authService.verifyAccessToken(token);
      request.user = decoded;

      if (!request.user.role) {
        throw new ForbiddenException('Роль не найдена');
      }

      return requiredRoles.includes(request.user.role);
    } catch (error) {
      throw new ForbiddenException('Неверный или просроченный токен');
    }
  }
}
