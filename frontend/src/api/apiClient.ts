import type { Bot, LogEntry, PaginatedResponse, Worker } from './types';

const DEFAAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
) {
  const url = new URL(
    `${import.meta.env.VITE_API_URL}${path}`,
    window.location.origin,
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Fetch error ${response.status}: ${body}`);
  }

  return response.json();
}

export const api = {
  fetchBots(page = DEFAULT_PAGE, pageSize = DEFAAULT_PAGE_SIZE) {
    return apiFetch<PaginatedResponse<Bot>>(
      buildUrl('/bots', { page, pageSize }),
    );
  },

  fetchWorkersForBot(
    botId: string,
    page = DEFAULT_PAGE,
    pageSize = DEFAAULT_PAGE_SIZE,
  ) {
    return apiFetch<PaginatedResponse<Worker>>(
      buildUrl(`/bots/${botId}/workers`, { page, pageSize }),
    );
  },

  fetchBotLogs(
    botId: string,
    page = DEFAULT_PAGE,
    pageSize = DEFAAULT_PAGE_SIZE,
  ) {
    return apiFetch<PaginatedResponse<LogEntry>>(
      buildUrl(`/bots/${botId}/logs`, { page, pageSize }),
    );
  },

  fetchWorkerLogs(
    botId: string,
    workerId: string,
    page = DEFAULT_PAGE,
    pageSize = DEFAAULT_PAGE_SIZE,
  ) {
    return apiFetch<PaginatedResponse<LogEntry>>(
      buildUrl(`/bots/${botId}/workers/${workerId}/logs`, { page, pageSize }),
    );
  },

  fetchBotById(botId: string) {
    return apiFetch<Bot>(buildUrl(`/bots/${botId}`));
  },

  fetchWorkerById(botId: string, workerId: string) {
    return apiFetch<Worker>(buildUrl(`/bots/${botId}/workers/${workerId}`));
  },
};
