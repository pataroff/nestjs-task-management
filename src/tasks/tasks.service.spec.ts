import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskEntity } from './task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  username: 'ivan',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const mockTask = {
  title: 'Test title',
  description: 'Test desc',
  id: 'someId',
  status: TaskStatus.OPEN,
};

const mockTasksRepository = () => ({
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
  findOne: jest.fn(),
});

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  describe('getTasks', () => {
    it('calls TasksService.getTasks and return the result', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([mockTask]);
      const result = await tasksService.getTasks({}, mockUser);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksService.getTaskById and returns the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksService.getTaskById and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
