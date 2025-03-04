import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Role } from './enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) { // сначала делаешь проверку if (!user) return , потом уже остальную логику. потому что ты еще не убедился что юзер есть, а уже напрягаешь сервис шифрованием
      const { password, ...result } = user; // энтити юзера может расширяться. лучше сразу создать функцию которая будет возвращать только нечувствительные поля
      return result;
    }
    throw new UnauthorizedException('Invalid credentials'); // это лучше делать в ифе в проверке на негативный кейс, а не как результат функции. чтобы если функция будет расширяться было очевидно что если функция доходит до конца значит все ок
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role }; // роль лучше проверять в базе в гарде. может быть такое что юзер уже не админ, а в токене у него еще указано что админ
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, role: string = 'user') {
    // роль не используется
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email уже используется');
    }
    return this.usersService.createUser(email, password);
  }

  async updateRole(identifier: string | number, newRole: Role) {
    return this.usersService.updateRole(identifier, newRole);
  }
}
