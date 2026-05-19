import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { BotsService } from '../../bots/bots.service';
import { WorkersService } from '../../workers/workers.service';
import { LogsRepository } from '../logs.repository';
import { LogsService } from '../logs.service';

describe('LogsService', () => {
  let service: LogsService;
  let repository: { findBotLogs: jest.Mock; findWorkerLogs: jest.Mock };
  let botsService: { getBotById: jest.Mock };
  let workersService: { getWorkerForBot: jest.Mock };

  beforeEach(async () => {
    repository = { findBotLogs: jest.fn(), findWorkerLogs: jest.fn() };
    botsService = { getBotById: jest.fn() };
    workersService = { getWorkerForBot: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LogsService,
        { provide: LogsRepository, useValue: repository },
        { provide: BotsService, useValue: botsService },
        { provide: WorkersService, useValue: workersService },
      ],
    }).compile();

    service = moduleRef.get(LogsService);
  });

  describe('getLogsForBot', () => {
    it('verifies the bot first, then fetches its logs', async () => {
      botsService.getBotById.mockResolvedValue({ id: 'b1' });
      repository.findBotLogs.mockResolvedValue({ items: [], total: 0 });

      const query = new PaginationQueryDto();
      query.page = 2;
      query.pageSize = 10;

      await service.getLogsForBot('b1', query);

      expect(botsService.getBotById).toHaveBeenCalledWith('b1');
      expect(repository.findBotLogs).toHaveBeenCalledWith('b1', 10, 10);
    });

    it('does not fetch logs when the bot is missing', async () => {
      botsService.getBotById.mockRejectedValue(
        new NotFoundException('Bot not found'),
      );

      await expect(
        service.getLogsForBot('missing', new PaginationQueryDto()),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findBotLogs).not.toHaveBeenCalled();
    });
  });

  describe('getLogsForWorker', () => {
    it('verifies bot+worker ownership before fetching logs', async () => {
      workersService.getWorkerForBot.mockResolvedValue({
        id: 'w1',
        botId: 'b1',
      });
      repository.findWorkerLogs.mockResolvedValue({ items: [], total: 0 });

      await service.getLogsForWorker('b1', 'w1', new PaginationQueryDto());

      expect(workersService.getWorkerForBot).toHaveBeenCalledWith('b1', 'w1');
      expect(repository.findWorkerLogs).toHaveBeenCalledWith('b1', 'w1', 0, 20);
    });

    it('does not fetch logs when the worker does not belong to the bot', async () => {
      workersService.getWorkerForBot.mockRejectedValue(
        new NotFoundException('Worker not found'),
      );

      await expect(
        service.getLogsForWorker('b1', 'w-other', new PaginationQueryDto()),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findWorkerLogs).not.toHaveBeenCalled();
    });
  });
});
