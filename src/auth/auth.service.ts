import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные данные для входа');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto); // <-- Передаем объект, а не два аргумента

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.createUser(registerDto);
      const tokens = this.generateTokens(user);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw new InternalServerErrorException('Ошибка регистрации пользователя');
    }
  }

  generateTokens(user: User) {
    const payload = { userId: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify<{ userId: string }>(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = Number(decoded.userId); // Приведение типа

      if (isNaN(userId)) {
        throw new UnauthorizedException(
          'Некорректный токен: userId должен быть числом',
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('Не удалось найти пользователя');
      }

      return user;
    } catch (error) {
      console.error('Ошибка проверки токена:', error);
      throw new UnauthorizedException('Токен недействителен или просрочен');
    }
  }

  async refreshTokens(refreshToken: string) {
    const decoded = this.verifyRefreshToken(refreshToken) as {
      userId: string;
    };
    const userId = Number(decoded.userId);

    if (isNaN(userId)) {
      throw new UnauthorizedException(
        'Некорректный токен: userId должен быть числом',
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh-токен невалиден');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Refresh-токен невалиден');
    }

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  verifyRefreshToken(refreshToken: string): { userId: string } {
    try {
      return this.jwtService.verify<{ userId: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh-токен недействителен');
    }
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }
}
