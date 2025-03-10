import {
  Body,
  Controller,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UpdateRoleDto } from 'users/dto/updateRole.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch('update-role')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ERole.ADMIN)
  async updateUserRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.userService.updateRole(updateRoleDto);
  }
}
