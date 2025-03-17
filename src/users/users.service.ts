import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw new InternalServerErrorException('Не удалось создать пользователя');
    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<boolean> {
    const { id, role } = updateRoleDto;

    const updateResult = await this.userRepository.update({ id }, { role });

    if (updateResult.affected === 0) {
      throw new NotFoundException('Пользователь не найден');
    }

    return true;
  }
}
