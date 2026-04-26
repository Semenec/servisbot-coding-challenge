import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';
import 'antd/dist/reset.css';
import BotsPage from './pages/Bots/BotsPage';
import BotWorkersPage from './pages/Workers/BotWorkersPage';
import BotLogsPage from './pages/Logs/BotLogsPage';
import WorkerLogsPage from './pages/Logs/WorkerLogsPage';
import NotFoundPage from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout className="app-layout">
          <Layout.Header className="app-header">
            <div className="app-logo">Services Bot Dashboard</div>
          </Layout.Header>

          <Layout.Content className="app-content">
            <Routes>
              <Route path="/" element={<BotsPage />} />
              <Route path="/bots/:botId/workers" element={<BotWorkersPage />} />
              <Route path="/bots/:botId/logs" element={<BotLogsPage />} />
              <Route
                path="/bots/:botId/workers/:workerId/logs"
                element={<WorkerLogsPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
