import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';

@UseGuards(AuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findOne(@Req() request: Request) {
    return this.usersService.findOne(request['user']._id);
  }

  @Put()
  update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request['user']._id, updateUserDto);
  }
}
