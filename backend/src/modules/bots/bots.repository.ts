import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    const [items, total] = await Promise.all([
      this.prisma.bot.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bot.count(),
    ]);

    return { items, total };
  }

  findById(id: string) {
    return this.prisma.bot.findUnique({ where: { id } });
  }
}
