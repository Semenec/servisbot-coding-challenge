import { Injectable, NotFoundException } from '@nestjs/common';
import { Worker } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { BotsService } from '../bots/bots.service';
import { WorkersRepository } from './workers.repository';

@Injectable()
export class WorkersService {
  constructor(
    private readonly workersRepository: WorkersRepository,
    private readonly botsService: BotsService,
  ) {}

  async getWorkersForBot(
    botId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<Worker>> {
    await this.botsService.getBotById(botId);

    const { take, skip } = query.resolve();

    return this.workersRepository.findByBot(botId, skip, take);
  }

  async getWorkerForBot(botId: string, workerId: string): Promise<Worker> {
    const worker = await this.workersRepository.findByBotAndId(botId, workerId);

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return worker;
  }
}
