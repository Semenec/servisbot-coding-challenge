import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { BotsService } from './bots.service';

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Get()
  getBots(@Query() query: PaginationQueryDto) {
    return this.botsService.getBots(query);
  }

  @Get(':botId')
  getBotById(@Param('botId', ParseUUIDPipe) botId: string) {
    return this.botsService.getBotById(botId);
  }
}
