import { Injectable } from '@nestjs/common';
import { Log } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { BotsService } from '../bots/bots.service';
import { WorkersService } from '../workers/workers.service';
import { LogsRepository } from './logs.repository';

@Injectable()
export class LogsService {
  constructor(
    private readonly logsRepository: LogsRepository,
    private readonly botsService: BotsService,
    private readonly workersService: WorkersService,
  ) {}

  async getLogsForBot(
    botId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<Log>> {
    await this.botsService.getBotById(botId);

    const { take, skip } = query.resolve();

    return this.logsRepository.findBotLogs(botId, skip, take);
  }

  async getLogsForWorker(
    botId: string,
    workerId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<Log>> {
    await this.workersService.getWorkerForBot(botId, workerId);

    const { take, skip } = query.resolve();

    return this.logsRepository.findWorkerLogs(botId, workerId, skip, take);
  }
}
