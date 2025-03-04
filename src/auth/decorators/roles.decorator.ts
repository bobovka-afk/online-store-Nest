import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum'

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// это можно сделать на уровне гарда тоже

// в целом, я бы админские роуты вынес бы в отдельную секцию и в отдельные контроллеры, для того чтобы отделить доступный юзеру функционал и не насрать случайно потом таким образом. Плюс, если потом надо будет выносить в отдельную админку то так это сделтаь будет легче.
