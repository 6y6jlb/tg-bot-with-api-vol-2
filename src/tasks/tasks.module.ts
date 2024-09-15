import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Tasks } from './entities/tasks.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/schemas/task.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Tasks.name, schema: TaskSchema }]),
  ],
})
export class TasksModule {}
