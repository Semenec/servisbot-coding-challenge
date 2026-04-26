import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

export function usePagination(options?: {
  defaultPage?: number;
  pageSize?: number;
}) {
  const { defaultPage = 1, pageSize = 10 } = options ?? {};
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePositiveInt(searchParams.get('page'), defaultPage);
  const currentPageSize = parsePositiveInt(
    searchParams.get('pageSize'),
    pageSize,
  );

  const updateQuery = useCallback(
    (nextPage: number, nextPageSize: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(nextPage));
      params.set('pageSize', String(nextPageSize));
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const onPageChange = useCallback(
    (nextPage: number, nextPageSize?: number) => {
      updateQuery(nextPage, nextPageSize ?? currentPageSize);
    },
    [currentPageSize, updateQuery],
  );

  return {
    page,
    pageSize: currentPageSize,
    onPageChange,
  };
}
