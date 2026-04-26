import { useQuery } from '@tanstack/react-query';
import { api } from '../api/apiClient';
import type { Bot, LogEntry, PaginatedResponse, Worker } from '../api';

export function useBots(page: number, pageSize = 10) {
  return useQuery<PaginatedResponse<Bot>, Error>({
    queryKey: ['bots', page, pageSize],
    queryFn: () => api.fetchBots(page, pageSize),
  });
}

export function useBotWorkers(botId: string, page: number, pageSize = 10) {
  return useQuery<PaginatedResponse<Worker>, Error>({
    queryKey: ['botWorkers', botId, page, pageSize],
    queryFn: () => api.fetchWorkersForBot(botId, page, pageSize),
    enabled: Boolean(botId),
  });
}

export function useBotLogs(botId: string, page: number, pageSize = 10) {
  return useQuery<PaginatedResponse<LogEntry>, Error>({
    queryKey: ['botLogs', botId, page, pageSize],
    queryFn: () => api.fetchBotLogs(botId, page, pageSize),
    enabled: Boolean(botId),
  });
}

export function useWorkerLogs(
  botId: string,
  workerId: string,
  page: number,
  pageSize = 10,
) {
  return useQuery<PaginatedResponse<LogEntry>, Error>({
    queryKey: ['workerLogs', botId, workerId, page, pageSize],
    queryFn: () => api.fetchWorkerLogs(botId, workerId, page, pageSize),
    enabled: Boolean(botId && workerId),
  });
}

export function useBotById(botId: string) {
  return useQuery<Bot, Error>({
    queryKey: ['bot', botId],
    queryFn: () => api.fetchBotById(botId),
    enabled: Boolean(botId),
  });
}

export function useWorkerById(botId: string, workerId: string) {
  return useQuery<Worker, Error>({
    queryKey: ['worker', botId, workerId],
    queryFn: () => api.fetchWorkerById(botId, workerId),
    enabled: Boolean(botId && workerId),
  });
}
