import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';
import { UpdateRoleDto } from 'users/dto/updateRole.dto';
import { BadRequestException } from '@nestjs/common';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
@UseGuards(RolesGuard, JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto): Promise<any> {
    const user = await this.authService.register(
      createUserDto.email,
      createUserDto.password,
    );
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      await this.authService.validateUser(loginDto.email, loginDto.password), // эта функция должна вызываться уже в сервисе, не в контроллере
    );
  }

  @Patch('update-role')
  @Roles(Role.Admin)
  async updateUserRole(@Body() { email, id, role }: UpdateRoleDto) {
    if (!email && !id) {
      throw new BadRequestException('Email или ID должны быть предоставлены');
    } // это проверяется на уровне дто

    if (email) { // нет необходимости в этих ифах. в крайнем случае делай это уже в сервисе, но не в контроллере
      return this.authService.updateRole(email, role);
    } else if (id) {
      return this.authService.updateRole(id, role);
    } else {
      throw new BadRequestException('Некорректные данные');
    }
  }
}
