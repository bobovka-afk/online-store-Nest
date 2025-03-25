import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';

import { UpdateRoleDto } from 'user/dto/updateRole.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationUserDto } from './dto/paginationUsers.dto';
import { User } from '../entities/user.entity';

@ApiTags('user')
@Controller('user')
@UseGuards(RolesGuard, JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update-role')
  @Roles(ERole.ADMIN)
  async updateUserRole(@Body() updateRoleDto: UpdateRoleDto): Promise<boolean> {
    return this.userService.updateRole(updateRoleDto);
  }

  @Get('list')
  @Roles(ERole.ADMIN)
  async getAllUsers(@Query() paginationUserDto: PaginationUserDto): Promise<{ data: Partial<User>[]; count: number }> {
    return this.userService.getAllUsers(paginationUserDto);
  }
}
