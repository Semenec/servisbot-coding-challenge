import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkersRepository } from '../workers.repository';

describe('WorkersRepository', () => {
  let repository: WorkersRepository;
  let prisma: {
    worker: { findFirst: jest.Mock; findMany: jest.Mock; count: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      worker: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkersRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repository = moduleRef.get(WorkersRepository);
  });

  describe('findByBotAndId', () => {
    it('scopes the lookup to the parent bot', async () => {
      const worker = { id: 'w1', botId: 'b1' };
      prisma.worker.findFirst.mockResolvedValue(worker);

      const result = await repository.findByBotAndId('b1', 'w1');

      expect(result).toBe(worker);
      expect(prisma.worker.findFirst).toHaveBeenCalledWith({
        where: { id: 'w1', botId: 'b1' },
      });
    });

    it('returns null when the worker exists but belongs to another bot', async () => {
      prisma.worker.findFirst.mockResolvedValue(null);
      await expect(
        repository.findByBotAndId('b1', 'w-from-other-bot'),
      ).resolves.toBeNull();
    });
  });

  describe('findByBot', () => {
    it('queries items and total scoped to botId', async () => {
      const items = [{ id: 'w1' }];
      prisma.worker.findMany.mockResolvedValue(items);
      prisma.worker.count.mockResolvedValue(1);

      const result = await repository.findByBot('b1', 0, 20);

      expect(result).toEqual({ items, total: 1 });
      expect(prisma.worker.findMany).toHaveBeenCalledWith({
        where: { botId: 'b1' },
        skip: 0,
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.worker.count).toHaveBeenCalledWith({
        where: { botId: 'b1' },
      });
    });
  });
});
