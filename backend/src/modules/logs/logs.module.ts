import { Module } from '@nestjs/common';
import { BotsModule } from '../bots/bots.module';
import { WorkersModule } from '../workers/workers.module';
import { LogsController } from './logs.controller';
import { LogsRepository } from './logs.repository';
import { LogsService } from './logs.service';

@Module({
  imports: [BotsModule, WorkersModule],
  controllers: [LogsController],
  providers: [LogsService, LogsRepository],
  exports: [LogsService],
})
export class LogsModule {}
