import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByBotAndId(botId: string, id: string) {
    return this.prisma.worker.findFirst({ where: { id, botId } });
  }

  async findByBot(botId: string, skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.worker.findMany({
        where: { botId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.worker.count({ where: { botId } }),
    ]);

    return { items, total };
  }
}
