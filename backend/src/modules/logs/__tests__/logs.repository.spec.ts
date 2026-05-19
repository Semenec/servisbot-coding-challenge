import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsRepository } from '../logs.repository';

describe('LogsRepository', () => {
  let repository: LogsRepository;
  let prisma: { log: { findMany: jest.Mock; count: jest.Mock } };

  const workerInclude = {
    worker: { select: { id: true, name: true } },
  };

  beforeEach(async () => {
    prisma = {
      log: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [LogsRepository, { provide: PrismaService, useValue: prisma }],
    }).compile();

    repository = moduleRef.get(LogsRepository);
  });

  describe('findBotLogs', () => {
    it('filters by botId and includes the worker summary', async () => {
      prisma.log.findMany.mockResolvedValue([{ id: 'l1' }]);
      prisma.log.count.mockResolvedValue(1);

      const result = await repository.findBotLogs('b1', 0, 50);

      expect(result).toEqual({ items: [{ id: 'l1' }], total: 1 });
      expect(prisma.log.findMany).toHaveBeenCalledWith({
        where: { botId: 'b1' },
        skip: 0,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: workerInclude,
      });
      expect(prisma.log.count).toHaveBeenCalledWith({ where: { botId: 'b1' } });
    });
  });

  describe('findWorkerLogs', () => {
    it('filters by both botId and workerId', async () => {
      prisma.log.findMany.mockResolvedValue([]);
      prisma.log.count.mockResolvedValue(0);

      await repository.findWorkerLogs('b1', 'w1', 10, 25);

      expect(prisma.log.findMany).toHaveBeenCalledWith({
        where: { botId: 'b1', workerId: 'w1' },
        skip: 10,
        take: 25,
        orderBy: { createdAt: 'desc' },
        include: workerInclude,
      });
      expect(prisma.log.count).toHaveBeenCalledWith({
        where: { botId: 'b1', workerId: 'w1' },
      });
    });
  });
});
