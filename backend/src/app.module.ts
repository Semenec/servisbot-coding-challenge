import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotsModule } from './modules/bots/bots.module';
import { LogsModule } from './modules/logs/logs.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { WorkersModule } from './modules/workers/workers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    BotsModule,
    WorkersModule,
    LogsModule,
  ],
})
export class AppModule {}
