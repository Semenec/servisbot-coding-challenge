import { Injectable, NotFoundException } from '@nestjs/common';
import { Bot } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { BotsRepository } from './bots.repository';

@Injectable()
export class BotsService {
  constructor(private readonly botsRepository: BotsRepository) {}

  async getBots(query: PaginationQueryDto): Promise<PaginatedResult<Bot>> {
    const { take, skip } = query.resolve();

    return this.botsRepository.findAll(skip, take);
  }

  async getBotById(id: string): Promise<Bot> {
    const bot = await this.botsRepository.findById(id);

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return bot;
  }
}
