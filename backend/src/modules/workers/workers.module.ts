import { Module } from '@nestjs/common';
import { BotsModule } from '../bots/bots.module';
import { WorkersController } from './workers.controller';
import { WorkersRepository } from './workers.repository';
import { WorkersService } from './workers.service';

@Module({
  imports: [BotsModule],
  controllers: [WorkersController],
  providers: [WorkersService, WorkersRepository],
  exports: [WorkersService],
})
export class WorkersModule {}
