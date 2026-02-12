import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  getTaskById(id: string): Promise<TaskEntity> {
    return this.tasksRepository.getTaskById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    return this.tasksRepository.updateTaskStatus(id, status);
  }

  deleteTask(id: string): Promise<void> {
    return this.tasksRepository.deleteTask(id);
  }
}
