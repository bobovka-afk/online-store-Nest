import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { PaginationUserDto } from './dto/paginationUsers.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
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

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  async getAllUsers(paginationUserDto: PaginationUserDto): Promise<{ data: Partial<User>[]; count: number }> {
    try {
      const { limit, offset } = paginationUserDto;
      const [users, total] = await this.userRepository.findAndCount({
        take: limit,
        skip: offset,
      });

      const filteredUsers = users.map(({ id, email, role, createdAt }) => ({
        id,
        email,
        role,
        createdAt,
      }));

      return {
        data: filteredUsers,
        count: total,
      };
    } catch {
      throw new InternalServerErrorException('Не удалось получить список пользователей');
    }
  }
}
