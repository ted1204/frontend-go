import { useEffect, useMemo, useState } from 'react';
import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import { BoxIcon, GridIcon, MoreDotIcon, TaskIcon } from '@/shared/icons';
import { getAuditLogs } from '@/core/services/auditService';
import { AuditLog } from '@/core/interfaces/audit';

const iconForAction = (action: string) => {
  const key = action.toLowerCase();
  if (key.includes('create')) return <TaskIcon className="h-5 w-5" />;
  if (key.includes('update') || key.includes('edit')) return <GridIcon className="h-5 w-5" />;
  if (key.includes('delete') || key.includes('remove')) return <BoxIcon className="h-5 w-5" />;
  return <MoreDotIcon className="h-5 w-5" />;
};

const badgeTone = (action: string) => {
  const key = action.toLowerCase();
  if (key.includes('create'))
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (key.includes('update') || key.includes('edit'))
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  if (key.includes('delete') || key.includes('remove'))
    return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
};

const toReadableDate = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleString();
};

const prettyJSON = (data: unknown) => {
  if (!data) return '';
  if (typeof data === 'string') {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

export default function AdminAuditLogs() {
  const { t } = useTranslation();
  const translate = (key: string, fallback: string) => {
    const translator = t as unknown as (k: string) => string | undefined;
    return translator(key) || fallback;
  };
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [action, setAction] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [limit, setLimit] = useState('100');

  const total = useMemo(() => logs.length, [logs]);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const query: Record<string, string | number> = {};
      if (userId.trim()) query.user_id = Number(userId);
      if (resourceType.trim()) query.resource_type = resourceType.trim();
      if (action.trim()) query.action = action.trim();
      if (startTime) query.start_time = new Date(startTime).toISOString();
      if (endTime) query.end_time = new Date(endTime).toISOString();
      if (limit.trim()) query.limit = Number(limit);

      const fetched = await getAuditLogs(query);
      setLogs(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFilters = () => {
    setUserId('');
    setResourceType('');
    setAction('');
    setStartTime('');
    setEndTime('');
    setLimit('100');
  };

  return (
    <div className="space-y-6">
      <PageMeta
        title={translate('page.admin.auditLogs.title', 'Audit Logs')}
        description={translate(
          'page.admin.auditLogs.description',
          'Review security and change events',
        )}
      />
      <PageBreadcrumb pageTitle={translate('page.admin.auditLogs.breadcrumb', 'Audit Logs')} />

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl dark:border-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
              {translate('page.admin.auditLogs.heroLabel', 'Observability')}
            </p>
            <h2 className="text-2xl font-semibold leading-tight">
              {translate(
                'page.admin.auditLogs.heroTitle',
                'Trace every admin action with confidence',
              )}
            </h2>
            <p className="text-slate-300 max-w-2xl text-sm">
              {translate(
                'page.admin.auditLogs.heroDesc',
                'Filter by user, resource, action, or time range. Quickly inspect before/after payloads to validate changes.',
              )}
            </p>
          </div>
          <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <GridIcon className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">User ID</label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              type="number"
              placeholder="e.g. 1"
              className="w-36 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">Resource</label>
            <input
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              placeholder="group / project / user"
              className="w-48 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">Action</label>
            <input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="create / update / delete"
              className="w-48 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">Start</label>
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              type="datetime-local"
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">End</label>
            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              type="datetime-local"
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">Limit</label>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              type="number"
              min={1}
              max={1000}
              className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-inner focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadLogs}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {loading ? 'Loading…' : 'Apply filters'}
            </button>
            <button
              onClick={() => {
                resetFilters();
                loadLogs();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 dark:border-rose-800/60 dark:bg-rose-900/40 dark:text-rose-100">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
              {translate('page.admin.auditLogs.total', 'Total entries')}
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{total}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {translate('page.admin.auditLogs.liveHint', 'Live data from /audit/logs')}
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            {translate('loading.default', 'Loading...')}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            {translate(
              'page.admin.auditLogs.empty',
              'No audit logs found for the selected filters.',
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {logs.map((log) => (
              <div
                key={log.id || log.ID}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:from-gray-900 dark:to-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${badgeTone(log.action)}`}
                  >
                    {iconForAction(log.action)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTone(log.action)}`}
                      >
                        {log.action}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {log.resource_type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ID {log.resource_id}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      <p className="font-semibold">User #{log.user_id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {toReadableDate(log.created_at)}
                      </p>
                    </div>
                    {log.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{log.description}</p>
                    )}
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-inner dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                        <p className="mb-1 font-semibold text-gray-900 dark:text-white">Before</p>
                        <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-gray-600 dark:text-gray-200">
                          {prettyJSON(log.old_data) || '—'}
                        </pre>
                      </div>
                      <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-inner dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                        <p className="mb-1 font-semibold text-gray-900 dark:text-white">After</p>
                        <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-gray-600 dark:text-gray-200">
                          {prettyJSON(log.new_data) || '—'}
                        </pre>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {log.ip_address && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
                          IP {log.ip_address}
                        </span>
                      )}
                      {log.user_agent && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
                          UA {log.user_agent}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
