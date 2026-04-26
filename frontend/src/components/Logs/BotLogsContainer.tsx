import { Card, Typography } from "antd";
import { useParams } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import { useBotById, useBotLogs } from "../../hooks/useQueries";

import { LogsTable } from "./LogsTable";
import { BreadcrumbTrail, PageLoadingState, EmptyState } from "../common";

export const BotLogsContainer = () => {
  const params = useParams<{ botId: string }>();
  const botId = params.botId ?? "";
  const { data: botData, isLoading: isBotLoading } = useBotById(botId);
  const botName = botData?.name ?? "";
  const { page, pageSize, onPageChange } = usePagination();
  const { data, isLoading, isError } = useBotLogs(botId, page, pageSize);
  const logs = data?.items ?? [];
  const isEmpty = logs.length === 0 && !isLoading && !isError;
  const isShowTable = !isLoading && !isError && logs.length > 0;
  const isShowLoadingState = isBotLoading || isLoading;

  return (
    <>
      <BreadcrumbTrail
        items={[
          { title: "Bots", path: "/" },
          { title: botName },
          { title: "Logs" },
        ]}
      />
      <Typography.Title level={2}>
        Logs for {botName || "Bot"}
      </Typography.Title>
      <Card>
        {isShowLoadingState && <PageLoadingState />}
        {isError && <EmptyState title="Unable to load bot logs" />}
        {isEmpty && <EmptyState title="No logs found" />}
        {isShowTable && (
          <LogsTable
            data={logs}
            total={data?.total ?? 0}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            showWorkerColumn={true}
            botId={botId}
          />
        )}
      </Card>
    </>
  );
};
