import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new ForbiddenException('Токен не предоставлен');
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('Токен отсутствует');
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;
      // request.user = await this.jwtService.verifyAsync(token);

      if (!request.user.role) {
        throw new ForbiddenException('Роль не найдена'); // этот throw ничего не делает, т.к. падает в кэтч
      }
      // проверка в базе правда ли у этого юзера есть эта роль
      return requiredRoles.includes(request.user.role);
    } catch (error) {
      throw new ForbiddenException('Неверный токен');
    }
  }
}
