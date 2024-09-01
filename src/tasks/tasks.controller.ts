import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ROLE } from 'src/common/const';
import { GetTaskDto } from './dto/get-task.dto';
import { Types } from 'mongoose';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() getTaskDto: GetTaskDto) {
    return this.tasksService.findAll(getTaskDto);
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId, @Query() getTaskDto: GetTaskDto) {
    return this.tasksService.findOne(id, getTaskDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.tasksService.remove(id);
  }
}
