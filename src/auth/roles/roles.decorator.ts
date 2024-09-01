import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/common/const';

export const Roles = (...args: ROLE[]) => SetMetadata('roles', args);
