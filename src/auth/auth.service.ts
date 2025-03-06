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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user){
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
      throw new UnauthorizedException
    }

    const payload = { sub: user.id, email: user.email, role: user.role };  // проверять роль в guard, а не при /login
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
}
