import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BotsRepository } from '../bots.repository';
import { BotsService } from '../bots.service';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

describe('BotsService', () => {
  let service: BotsService;
  let repository: { findAll: jest.Mock; findById: jest.Mock };

  beforeEach(async () => {
    repository = { findAll: jest.fn(), findById: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        BotsService,
        { provide: BotsRepository, useValue: repository },
      ],
    }).compile();

    service = moduleRef.get(BotsService);
  });

  describe('getBots', () => {
    it('passes resolved skip/take to the repository', async () => {
      const query = new PaginationQueryDto();
      query.page = 2;
      query.pageSize = 25;

      const expected = { items: [{ id: 'b1' }], total: 1 };
      repository.findAll.mockResolvedValue(expected);

      const result = await service.getBots(query);

      expect(repository.findAll).toHaveBeenCalledWith(25, 25);
      expect(result).toBe(expected);
    });

    it('propagates BadRequestException from query.resolve()', async () => {
      const query = new PaginationQueryDto();
      query.page = 1001;
      query.pageSize = 100;

      await expect(service.getBots(query)).rejects.toThrow(
        /Pagination depth exceeded/,
      );
      expect(repository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('getBotById', () => {
    it('returns the bot when found', async () => {
      const bot = { id: 'b1' };
      repository.findById.mockResolvedValue(bot);

      await expect(service.getBotById('b1')).resolves.toBe(bot);
    });

    it('throws NotFoundException when missing', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getBotById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
