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

  async create(createTaskDto: CreateTaskDto) {
    return await this.taskModel.create(createTaskDto);
  }

  async findAll(getTaskDto: GetTaskDto) {
    console.log('fing all');
    return await this.taskModel.find(getTaskDto);
  }

  async findOne(id: Types.ObjectId, getTaskDto: GetTaskDto) {
    return await this.taskModel.findById(id, getTaskDto, { new: true });
  }

  async update(id: Types.ObjectId, updateTaskDto: UpdateTaskDto) {
    return await this.taskModel.findByIdAndUpdate(id, updateTaskDto);
  }

  async remove(id: Types.ObjectId) {
    return await this.taskModel.findByIdAndDelete(id);
  }
}
