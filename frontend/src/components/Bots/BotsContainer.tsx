import { usePagination } from '../../hooks/usePagination';
import { useBots } from '../../hooks/useQueries';
import { PageLoadingState, EmptyState } from '../common';
import { BotsTable } from './BotsTable';

export const BotsContainer: React.FC = () => {
  const { page, pageSize, onPageChange } = usePagination();
  const { data, isLoading, isError } = useBots(page, pageSize);
  const bots = data?.items ?? [];
  const isEmpty = bots.length === 0 && !isLoading && !isError;
  const isShowTable = !isLoading && !isError && bots.length > 0;

  return (
    <>
      {isLoading && <PageLoadingState />}
      {isError && <EmptyState title="Unable to load bots" />}
      {isEmpty && <EmptyState title="No bots available" />}
      {isShowTable && (
        <BotsTable
          data={bots}
          total={data?.total ?? 0}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};
