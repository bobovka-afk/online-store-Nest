import { Body, Controller, Patch, UseGuards } from '@nestjs/common';

import { UpdateRoleDto } from 'user/dto/updateRole.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

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
}
