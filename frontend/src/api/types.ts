export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface Bot {
  id: string;
  name: string;
  description: string | null;
  status: BotStatus;
  createdAt: string;
}

export enum BotStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  PAUSED = 'PAUSED',
}

export interface Worker {
  id: string;
  name: string;
  description: string | null;
  botId: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  createdAt: string;
  message: string;
  botId: string;
  worker: {
    id: string;
    name: string;
  };
  workerId: string;
}
