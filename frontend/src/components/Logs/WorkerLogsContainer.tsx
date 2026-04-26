import { Card, Typography } from "antd";
import { useParams } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import {
  useBotById,
  useWorkerById,
  useWorkerLogs,
} from "../../hooks/useQueries";
import { LogsTable } from "./LogsTable";
import { BreadcrumbTrail, PageLoadingState, EmptyState } from "../common";

export const WorkerLogsContainer = () => {
  const params = useParams<{ botId: string; workerId: string }>();
  const botId = params.botId ?? "";
  const workerId = params.workerId ?? "";
  const { data: botData, isLoading: isBotLoading } = useBotById(botId);
  const botName = botData?.name ?? "";
  const { data: workerData, isLoading: isWorkerLoading } = useWorkerById(
    botId,
    workerId,
  );
  const workerName = workerData?.name ?? "";
  const { page, pageSize, onPageChange } = usePagination();
  const { data, isLoading, isError } = useWorkerLogs(
    botId,
    workerId,
    page,
    pageSize,
  );
  const logs = data?.items ?? [];
  const isEmpty = logs.length === 0 && !isLoading && !isError;
  const isShowTable = !isLoading && !isError && logs.length > 0;
  const isShowLoadingState = isBotLoading || isWorkerLoading || isLoading;

  return (
    <>
      <BreadcrumbTrail
        items={[
          { title: "Bots", path: "/" },
          { title: botName },
          { title: workerName },
          { title: "Logs" },
        ]}
      />
      <Typography.Title level={2}>
        Logs for {workerName}
      </Typography.Title>
      <Card>
        {isShowLoadingState && <PageLoadingState />}
        {isError && (
          <EmptyState
            title="Unable to load worker logs"
          />
        )}
        {isEmpty && (
          <EmptyState
            title="No logs found"
          />
        )}
        {isShowTable && (
          <LogsTable
            data={logs}
            total={data?.total ?? 0}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
      </Card>
    </>
  );
};
