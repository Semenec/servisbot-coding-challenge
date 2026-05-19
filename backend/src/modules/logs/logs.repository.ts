import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBotLogs(botId: string, skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.log.findMany({
        where: { botId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          worker: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.log.count({ where: { botId } }),
    ]);

    return { items, total };
  }

  async findWorkerLogs(
    botId: string,
    workerId: string,
    skip: number,
    take: number,
  ) {
    const [items, total] = await Promise.all([
      this.prisma.log.findMany({
        where: { botId, workerId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          worker: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.log.count({ where: { botId, workerId } }),
    ]);

    return { items, total };
  }
}
