import { Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { useBotById, useBotWorkers } from '../../hooks/useQueries';
import { WorkersTable } from './WorkersTable';
import { BreadcrumbTrail, PageLoadingState, EmptyState } from '../common';

export const BotWorkersContainer = () => {
  const params = useParams<{ botId: string }>();
  const botId = params.botId ?? '';

  const { page, pageSize, onPageChange } = usePagination();
  const { data: botData, isLoading: isBotLoading } = useBotById(botId ?? '');
  const { data, isLoading, isError } = useBotWorkers(botId, page, pageSize);

  const workers = data?.items ?? [];
  const botName = botData?.name ?? '';
  const isEmpty = workers.length === 0 && !isLoading && !isError;
  const isShowTable = !isLoading && !isError && workers.length > 0;
  const isShowLoadingState = isBotLoading || isLoading;

  return (
    <>
      <BreadcrumbTrail
        items={[
          { title: 'Bots', path: '/' },
          { title: botName },
          { title: 'Workers' },
        ]}
      />
      <Typography.Title level={2}>Workers for {botName}</Typography.Title>
      <Card>
        {isShowLoadingState && <PageLoadingState />}
        {isError && <EmptyState title="Unable to load workers" />}
        {isEmpty && <EmptyState title="No workers found" />}
        {isShowTable && (
          <WorkersTable
            data={workers}
            total={data?.total ?? 0}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            botId={botId}
          />
        )}
      </Card>
    </>
  );
};
