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
    // у тебя нет в дто проверки на длинну пароля. если кто-то отправит тебе огромную строку и нода начнет ее шифровать твой сервер на этом закончится

    // плюс десять раундов соли маловато для современных реалий, лучше 12
    const hashedPassword = await bcrypt.hash(password, 10);

    // есть логика для смены/восстановления пароля?
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async updateRole(identifier: string | number, newRole: Role) {
    const updateResult = await this.userRepository.update(
        // делай поиск только по одному полю. желательно по айди, т.к. оно уже проиндексировано
      typeof identifier === 'string'
        ? { email: identifier }
        : { id: identifier },
      { role: newRole },
    );

    // тут лучше if (!updateResult?.affected) throw new BadRequestException('Invalid user');
    // знак вопроса для того чтобы обезопаситься от того что переменная будет андефайнд
    // badrequestexception для того чтобы нест сразу сформировал хттп ответ с 400 ошибкой
    if (updateResult.affected === 0) {
      throw new Error('Пользователь не найден');
    }

    return { message: 'Роль успешно обновлена' }; // return true
  }
}
