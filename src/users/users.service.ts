import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async updateRole(identifier: string | number, newRole: Role) {
    const updateResult = await this.userRepository.update(
      typeof identifier === 'string'
        ? { email: identifier }
        : { id: identifier },
      { role: newRole },
    );

    if (updateResult.affected === 0) {
      throw new Error('Пользователь не найден');
    }
    return { message: 'Роль успешно обновлена' };
  }
}
