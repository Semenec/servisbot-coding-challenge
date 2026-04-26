import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { BotsService } from '../../bots/bots.service';
import { WorkersRepository } from '../workers.repository';
import { WorkersService } from '../workers.service';

describe('WorkersService', () => {
  let service: WorkersService;
  let repository: { findByBot: jest.Mock; findByBotAndId: jest.Mock };
  let botsService: { getBotById: jest.Mock };

  beforeEach(async () => {
    repository = { findByBot: jest.fn(), findByBotAndId: jest.fn() };
    botsService = { getBotById: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkersService,
        { provide: WorkersRepository, useValue: repository },
        { provide: BotsService, useValue: botsService },
      ],
    }).compile();

    service = moduleRef.get(WorkersService);
  });

  describe('getWorkersForBot', () => {
    it('verifies the bot exists before querying workers', async () => {
      botsService.getBotById.mockResolvedValue({ id: 'b1' });
      repository.findByBot.mockResolvedValue({ items: [], total: 0 });

      const query = new PaginationQueryDto();
      await service.getWorkersForBot('b1', query);

      expect(botsService.getBotById).toHaveBeenCalledWith('b1');
      expect(repository.findByBot).toHaveBeenCalledWith('b1', 0, 20);
    });

    it('does not query workers when the bot is missing', async () => {
      botsService.getBotById.mockRejectedValue(
        new NotFoundException('Bot not found'),
      );

      await expect(
        service.getWorkersForBot('missing', new PaginationQueryDto()),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findByBot).not.toHaveBeenCalled();
    });
  });

  describe('getWorkerForBot', () => {
    it('returns the worker when it belongs to the bot', async () => {
      const worker = { id: 'w1', botId: 'b1' };
      repository.findByBotAndId.mockResolvedValue(worker);

      await expect(service.getWorkerForBot('b1', 'w1')).resolves.toBe(worker);
    });

    it('throws NotFoundException when no worker matches the bot+id pair', async () => {
      repository.findByBotAndId.mockResolvedValue(null);

      await expect(service.getWorkerForBot('b1', 'w1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
