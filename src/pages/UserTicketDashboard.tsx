import { useState, useEffect } from 'react';
import { getMyTickets } from '../services/ticketService';
import { Ticket, TicketStatus } from '../interfaces/ticket';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';

export default function UserTicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法取得工單');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case TicketStatus.Processing:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case TicketStatus.Completed:
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case TicketStatus.Rejected:
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Pending:
        return '待處理';
      case TicketStatus.Processing:
        return '處理中';
      case TicketStatus.Completed:
        return '已完成';
      case TicketStatus.Rejected:
        return '已駁回';
      default:
        return status;
    }
  };

  if (loading) return <div className="p-6 text-center">載入工單中...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div>
      <PageMeta title="我的工單" description="檢視您的支援請求" />
      <PageBreadcrumb pageTitle="我的工單" />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  專案
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  標題 / 描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  日期
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {tickets.map((ticket) => (
                <tr key={ticket.ID}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    #{ticket.ID}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {ticket.project ? (
                      <span className="font-mono">{ticket.project.ProjectName}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ticket.description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.CreatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    找不到工單。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
