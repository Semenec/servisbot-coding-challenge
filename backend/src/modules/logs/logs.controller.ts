import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { LogsService } from './logs.service';

@Controller('bots/:botId')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('logs')
  getLogsForBot(
    @Param('botId', ParseUUIDPipe) botId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.logsService.getLogsForBot(botId, query);
  }

  @Get('workers/:workerId/logs')
  getLogsForWorker(
    @Param('botId', ParseUUIDPipe) botId: string,
    @Param('workerId', ParseUUIDPipe) workerId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.logsService.getLogsForWorker(botId, workerId, query);
  }
}
