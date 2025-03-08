import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from 'users/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // возможно заменить на функцию
      return result;
    } else {
      throw new UnauthorizedException('Неверные данные для входа');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email, role: user.role }; // проверять роль в guard, а не при /login
    const expiresIn = '1h';
    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
    };
  }

  async register(email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email уже используется');
    }
    return this.usersService.createUser(email, password);
  }

  async verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Токен недействителен');
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh-токен недействителен');
    }
  }

  async generateTokens(user: User) {
    const payload = { userId: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const decoded = await this.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return this.generateTokens(user);
  }
}
