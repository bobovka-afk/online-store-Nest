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
import { Request, Response } from 'express';
import { DecodedUser } from 'auth/interfaces/decoded-user.interface';

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

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    let accessToken = this.extractAccessToken(request);

    if (!accessToken) {
      const refreshToken = request.cookies?.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('Токен не предоставлен и Refresh-токен отсутствует');
      }

      try {
        const tokens = await this.authService.refreshTokens(refreshToken);

        response.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        response.setHeader('Authorization', `Bearer ${tokens.accessToken}`);

        request.user = await this.authService.verifyAccessToken(tokens.accessToken);
        return this.hasRequiredRole(request.user as DecodedUser, requiredRoles);
      } catch (refreshError) {
        throw new UnauthorizedException('Не удалось обновить токен');
      }
    }

    try {
      const decoded = await this.authService.verifyAccessToken(accessToken);
      request.user = decoded;

      return this.hasRequiredRole(request.user as DecodedUser, requiredRoles);
    } catch (error) {
      throw new UnauthorizedException('Неверный или просроченный токен');
    }
  }

  private extractAccessToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    return authHeader ? authHeader.split(' ')[1] : null;
  }

  private hasRequiredRole(user: DecodedUser, requiredRoles: ERole[]): boolean {
    if (!user.role) {
      throw new ForbiddenException('Роль не найдена');
    }

    return requiredRoles.includes(user.role);
  }
}
