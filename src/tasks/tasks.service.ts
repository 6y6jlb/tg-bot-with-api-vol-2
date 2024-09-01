import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks } from './entities/tasks.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetTaskDto } from './dto/get-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Tasks.name) private taskModel: Model<Tasks>) {}

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  findAll(getTaskDto: GetTaskDto) {
    return this.taskModel.find(getTaskDto);
  }

  findOne(id: Types.ObjectId, getTaskDto: GetTaskDto) {
    return this.taskModel.findById(id, getTaskDto);
  }

  update(id: Types.ObjectId, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: Types.ObjectId) {
    return `This action removes a #${id} task`;
  }
}
