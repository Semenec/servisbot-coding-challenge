import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { BotsRepository } from '../bots.repository';

describe('BotsRepository', () => {
  let repository: BotsRepository;
  let prisma: {
    bot: { findMany: jest.Mock; count: jest.Mock; findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      bot: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [BotsRepository, { provide: PrismaService, useValue: prisma }],
    }).compile();

    repository = moduleRef.get(BotsRepository);
  });

  describe('findAll', () => {
    it('queries items and total in parallel and returns them together', async () => {
      const items = [{ id: 'b1' }];
      prisma.bot.findMany.mockResolvedValue(items);
      prisma.bot.count.mockResolvedValue(1);

      const result = await repository.findAll(20, 10);

      expect(result).toEqual({ items, total: 1 });
      expect(prisma.bot.findMany).toHaveBeenCalledWith({
        skip: 20,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.bot.count).toHaveBeenCalledWith();
    });
  });

  describe('findById', () => {
    it('delegates to prisma.bot.findUnique by id', async () => {
      const bot = { id: 'b1' };
      prisma.bot.findUnique.mockResolvedValue(bot);

      const result = await repository.findById('b1');

      expect(result).toBe(bot);
      expect(prisma.bot.findUnique).toHaveBeenCalledWith({
        where: { id: 'b1' },
      });
    });

    it('returns null when not found', async () => {
      prisma.bot.findUnique.mockResolvedValue(null);
      await expect(repository.findById('missing')).resolves.toBeNull();
    });
  });
});
