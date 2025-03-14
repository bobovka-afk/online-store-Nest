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
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    try {
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
    } catch (error) {
      console.error('Ошибка при валидации пользователя:', error);
      throw new InternalServerErrorException('Ошибка валидации пользователя');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto); // <-- Передаем объект, а не два аргумента

    const tokens = await this.generateTokens(user);
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
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Токен недействителен или просрочен');
    }
  }

  async refreshTokens(refreshToken: string) {
    const decoded = await this.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh-токен невалиден');
    }

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
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
