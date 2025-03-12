import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
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
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Неверные данные для входа');
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email уже используется');
    }

    const user = await this.usersService.createUser(email, password);
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
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
    } catch (error) {
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
    } catch (error) {
      throw new UnauthorizedException('Refresh-токен недействителен');
    }
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }
}
