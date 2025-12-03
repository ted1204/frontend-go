import { useState, useEffect } from 'react';
import { getAllTickets, updateTicketStatus } from '../services/ticketService';
import { Ticket, TicketStatus } from '../interfaces/ticket';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';

export default function AdminTicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法取得工單');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: TicketStatus) => {
    try {
      await updateTicketStatus(id, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.ID === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert('無法更新狀態: ' + (err instanceof Error ? err.message : String(err)));
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
      <PageMeta title="工單儀表板" description="管理使用者支援請求" />
      <PageBreadcrumb pageTitle="支援工單" />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  使用者
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
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {tickets.map((ticket) => (
                <tr key={ticket.ID}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    #{ticket.ID}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {ticket.user?.Username || ticket.user_id}
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
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      {ticket.status === TicketStatus.Pending && (
                        <>
                          <button
                            onClick={() => handleStatusChange(ticket.ID, TicketStatus.Processing)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            處理
                          </button>
                          <button
                            onClick={() => handleStatusChange(ticket.ID, TicketStatus.Rejected)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            駁回
                          </button>
                        </>
                      )}
                      {ticket.status === TicketStatus.Processing && (
                        <button
                          onClick={() => handleStatusChange(ticket.ID, TicketStatus.Completed)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          完成
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
