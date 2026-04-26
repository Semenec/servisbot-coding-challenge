import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BotStatus, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

interface BotJson {
  id: string;
  name: string;
  description: string | null;
  status: BotStatus;
  created: number;
}

interface WorkerJson {
  id: string;
  name: string;
  description: string | null;
  bot: string;
  created: number;
}

interface LogJson {
  id: string;
  created: string;
  message: string;
  bot: string;
  worker: string;
}

const DATA_DIR = join(__dirname, '..', '..', 'data');

function load<T>(file: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8')) as T;
}

async function main() {
  const bots = load<BotJson[]>('bots.json');
  const workers = load<WorkerJson[]>('workers.json');
  const logs = load<LogJson[]>('logs.json');

  const botIds = new Set(bots.map((b) => b.id));
  const nameToBotId = new Map(bots.map((b) => [b.name, b.id]));
  const workerIdToBotId = new Map<string, string>();

  for (const w of workers) {
    const botId = nameToBotId.get(w.bot);

    if (!botId) {
      throw new Error(`Worker ${w.id} references unknown bot name "${w.bot}"`);
    }
    workerIdToBotId.set(w.id, botId);
  }

  const validLogs: LogJson[] = [];

  for (const l of logs) {
    if (!botIds.has(l.bot)) {
      console.warn(`Skipping log ${l.id}: unknown bot id "${l.bot}"`);
      continue;
    }

    const expectedBotId = workerIdToBotId.get(l.worker);
    if (!expectedBotId) {
      console.warn(`Skipping log ${l.id}: unknown worker id "${l.worker}"`);
      continue;
    }

    if (expectedBotId !== l.bot) {
      console.warn(
        `Skipping log ${l.id}: references bot "${l.bot}" but worker "${l.worker}" belongs to bot "${expectedBotId}"`,
      );
      continue;
    }

    validLogs.push(l);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    await prisma.$transaction(async (tx) => {
      await tx.log.deleteMany();
      await tx.worker.deleteMany();
      await tx.bot.deleteMany();

      await tx.bot.createMany({
        data: bots.map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          status: b.status,
          createdAt: new Date(b.created),
        })),
      });

      await tx.worker.createMany({
        data: workers.map((w) => ({
          id: w.id,
          name: w.name,
          description: w.description,
          botId: nameToBotId.get(w.bot)!,
          createdAt: new Date(w.created),
        })),
      });

      await tx.log.createMany({
        data: validLogs.map((l) => ({
          id: l.id,
          message: l.message,
          botId: l.bot,
          workerId: l.worker,
          createdAt: new Date(l.created),
        })),
      });
    });

    console.log(
      `Seeded ${bots.length} bots, ${workers.length} workers, ${validLogs.length} logs` +
        (validLogs.length !== logs.length
          ? ` (skipped ${logs.length - validLogs.length} invalid)`
          : ''),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
