import { useEffect, useMemo, useState } from 'react';
import { PageMeta } from '@nthucscc/components-shared';
import { PageBreadcrumb } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
// Assuming these are your existing domain icons
import { BoxIcon, GridIcon, MoreDotIcon, TaskIcon } from '@/shared/icons';
import { getAuditLogs } from '@/core/services/auditService';
import { AuditLog } from '@/core/interfaces/audit';

// --- UI Icons (Inline for portability, replace with lucide-react or heroicons if available) ---

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </svg>
);

const RefreshIcon = ({ className, spin }: { className?: string; spin?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} ${spin ? 'animate-spin' : ''}`}
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// --- Helpers ---

/**
 * Maps audit actions to specific visual icons.
 */
const getActionIcon = (action: string) => {
  const key = action.toLowerCase();
  const baseClass = 'h-5 w-5';

  if (key.includes('create')) return <TaskIcon className={baseClass} />;
  if (key.includes('update') || key.includes('edit')) return <GridIcon className={baseClass} />;
  if (key.includes('delete') || key.includes('remove')) return <BoxIcon className={baseClass} />;
  return <MoreDotIcon className={baseClass} />;
};

/**
 * Returns Tailwind classes for badges and borders based on action type.
 */
const getActionTheme = (action: string) => {
  const key = action.toLowerCase();

  // Create: Green
  if (key.includes('create')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-800/40',
    };
  }
  // Update: Blue
  if (key.includes('update') || key.includes('edit')) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-800/40',
    };
  }
  // Delete: Red/Rose
  if (key.includes('delete') || key.includes('remove')) {
    return {
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800',
      iconBg: 'bg-rose-100 dark:bg-rose-800/40',
    };
  }
  // Default: Gray
  return {
    bg: 'bg-gray-50 dark:bg-gray-800/40',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
  };
};

/**
 * Formats ISO date strings based on the user's locale (en-US or zh-TW).
 */
const formatLocalizedDate = (dateString: string, locale: string = 'en-US') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format is standard for logs
  }).format(date);
};

const safePrettyJSON = (data: unknown): string | null => {
  if (!data) return null;
  try {
    const obj = typeof data === 'string' ? JSON.parse(data) : data;
    // Check if object is empty
    if (typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0) {
      return null;
    }
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(data);
  }
};

// --- Main Component ---

export default function AdminAuditLogs() {
  const { t, lang } = useTranslation();

  // Safe access to current language, defaults to English
  const currentLang = typeof lang === 'string' ? lang : 'en-US';

  const translate = (key: string, fallback: string) => {
    const translator = t as unknown as (k: string) => string | undefined;
    return translator(key) || fallback;
  };

  // State Management
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collapsible state for each log entry
  const [expandedIds, setExpandedIds] = useState<Set<number | string>>(new Set());

  // Filter States
  const [filters, setFilters] = useState({
    userId: '',
    resourceType: '',
    action: '',
    startTime: '',
    endTime: '',
    limit: '50',
  });

  const totalLogs = useMemo(() => logs.length, [logs]);

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const query: Record<string, string | number> = {};
      if (filters.userId.trim()) query.user_id = Number(filters.userId);
      if (filters.resourceType.trim()) query.resource_type = filters.resourceType.trim();
      if (filters.action.trim()) query.action = filters.action.trim();
      if (filters.startTime) query.start_time = new Date(filters.startTime).toISOString();
      if (filters.endTime) query.end_time = new Date(filters.endTime).toISOString();
      if (filters.limit) query.limit = Number(filters.limit);

      const fetched = await getAuditLogs(query);
      console.log(fetched);
      setLogs(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleExpand = (id: number | string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const resetFilters = () => {
    setFilters({
      userId: '',
      resourceType: '',
      action: '',
      startTime: '',
      endTime: '',
      limit: '50',
    });
    // Optional: auto-reload after reset or let user click search
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4">
      <PageMeta
        title={translate('page.admin.auditLogs.title', 'Audit Logs')}
        description={translate(
          'page.admin.auditLogs.description',
          'System security and change tracking',
        )}
      />
      <PageBreadcrumb pageTitle={translate('page.admin.auditLogs.breadcrumb', 'Audit Logs')} />

      {/* Hero / Header Section */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {translate('page.admin.auditLogs.heading', 'Audit Trails')}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {translate(
              'page.admin.auditLogs.subHeading',
              'Monitor and analyze administrative actions and resource changes.',
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {translate('common.live', 'Live')}
          </div>
        </div>
      </div>

      {/* Control Panel (Filters) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {translate('filter.title', 'Filter Criteria')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* User ID Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {translate('filter.userId', 'User ID')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                placeholder={translate('filter.placeholder.userId', 'Search by ID...')}
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />
            </div>
          </div>

          {/* Resource Type Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {translate('filter.resource', 'Resource')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LayersIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.resourceType}
                onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                placeholder={translate('filter.placeholder.resource', 'e.g. project, user')}
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />
            </div>
          </div>

          {/* Action Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {translate('filter.action', 'Action')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                placeholder={translate('filter.placeholder.action', 'e.g. create, update')}
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />
            </div>
          </div>

          {/* Limit Input Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {translate('filter.limit', 'Rows')}
            </label>
            <div className="relative">
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="block w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="space-y-1.5 xl:col-span-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {translate('filter.dateRange', 'Time Range')}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={filters.startTime}
                  onChange={(e) => handleFilterChange('startTime', e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
              <span className="hidden self-center text-gray-400 sm:block">→</span>
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  value={filters.endTime}
                  onChange={(e) => handleFilterChange('endTime', e.target.value)}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {totalLogs > 0 &&
              translate('page.admin.auditLogs.count', `Showing latest ${totalLogs} records`)}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetFilters();
                loadLogs();
              }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {translate('common.reset', 'Reset')}
            </button>
            <button
              onClick={loadLogs}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
            >
              {loading && <RefreshIcon className="h-4 w-4" spin />}
              {translate('common.apply', 'Apply Filters')}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Timeline List */}
      <div className="relative space-y-6">
        {/* Vertical Timeline Guide Line */}
        <div className="absolute bottom-0 left-[27px] top-4 hidden w-px bg-gray-200 dark:bg-gray-800 sm:block" />

        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <RefreshIcon className="h-10 w-10 text-gray-300 dark:text-gray-700" spin />
            <p className="mt-4 text-sm">{translate('common.loading', 'Loading data...')}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-24 text-center dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <SearchIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              {translate('page.admin.auditLogs.emptyTitle', 'No logs found')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {translate('page.admin.auditLogs.emptyDesc', 'Adjust filters to see more results.')}
            </p>
          </div>
        ) : (
          logs.map((log, index) => {
            const logId: number | string = log.id ?? log.ID ?? index;
            const theme = getActionTheme(log.action);
            const isExpanded = expandedIds.has(logId);
            const prettyOld = safePrettyJSON(log.old_data);
            const prettyNew = safePrettyJSON(log.new_data);
            const hasDiff = prettyOld || prettyNew;

            return (
              <div key={logId} className="relative pl-0 sm:pl-16">
                {/* Timeline Icon Node */}
                <div
                  className={`absolute left-0 top-1 hidden h-14 w-14 items-center justify-center rounded-full border-[6px] border-white bg-white dark:border-black dark:bg-black sm:flex`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.bg} ${theme.text}`}
                  >
                    {getActionIcon(log.action)}
                  </div>
                </div>

                {/* Card Content */}
                <div
                  className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 ${theme.border} ${isExpanded ? 'ring-1 ring-blue-500/20' : ''}`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${theme.bg} ${theme.text}`}
                        >
                          {log.action}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          <LayersIcon className="h-3 w-3" />
                          {log.resource_type}
                        </span>
                        <span className="text-xs font-mono text-gray-400">#{log.resource_id}</span>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {log.description || (
                          <span className="italic text-gray-400">
                            {translate('log.noDescription', 'No description recorded')}
                          </span>
                        )}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="h-3.5 w-3.5" />
                          <span className="font-medium text-gray-900 dark:text-gray-300">
                            User {log.user_id}
                          </span>
                        </div>
                        {log.ip_address && (
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                            {log.ip_address}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <time>{formatLocalizedDate(log.created_at, currentLang)}</time>
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    {hasDiff && (
                      <button
                        onClick={() => toggleExpand(logId)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${isExpanded ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                      >
                        {isExpanded
                          ? translate('log.hide', 'Hide Details')
                          : translate('log.view', 'View Changes')}
                        <ChevronDownIcon
                          className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Expanded JSON Diff View */}
                  {isExpanded && hasDiff && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-black/20">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Old Data */}
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                          <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50">
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                              {translate('log.before', 'Before')}
                            </span>
                          </div>
                          <pre className="max-h-64 overflow-auto p-3 text-[11px] font-mono leading-relaxed text-gray-600 dark:text-gray-300">
                            {prettyOld || <span className="italic text-gray-400">null</span>}
                          </pre>
                        </div>

                        {/* New Data */}
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                          <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              {translate('log.after', 'After')}
                            </span>
                          </div>
                          <pre className="max-h-64 overflow-auto p-3 text-[11px] font-mono leading-relaxed text-gray-600 dark:text-gray-300">
                            {prettyNew || <span className="italic text-gray-400">null</span>}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
