import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.userRepository.save({
      email,
      password: hashedPassword,
    });
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<boolean> {
    const { id, role } = updateRoleDto;

    const updateResult = await this.userRepository.update({ id }, { role });

    if (updateResult.affected === 0) {
      throw new Error('Пользователь не найден');
    }

    return true;
  }
}
