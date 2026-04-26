import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { WorkersService } from './workers.service';

@Controller('bots/:botId/workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  getWorkersForBot(
    @Param('botId', ParseUUIDPipe) botId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.workersService.getWorkersForBot(botId, query);
  }

  @Get(':workerId')
  getWorkerForBot(
    @Param('botId', ParseUUIDPipe) botId: string,
    @Param('workerId', ParseUUIDPipe) workerId: string,
  ) {
    return this.workersService.getWorkerForBot(botId, workerId);
  }
}
