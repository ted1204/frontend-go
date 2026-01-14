import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGlobalWebSocket } from '@/core/context/useGlobalWebSocket';
import { PageBreadcrumb } from '@nthucscc/ui';
import { SearchInput } from '@nthucscc/components-shared';
import { LuActivity } from 'react-icons/lu';
import { useTranslation } from '@nthucscc/utils';

// Auth & Project Services (與 PodTable 一致)
import { getUsername } from '@/core/services/authService';
import { getProjectListByUser, getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { Project } from '@/core/interfaces/project';

// Local imports
import { InferredJob, JobPodMap, JobPod } from './types';
import { JobTable } from './JobTable';
import { PodLogsModal } from '../Pod/PodLogsModal';

const JobsLivePage: React.FC = () => {
  const [search, setSearch] = useState('');

  // Pod Log Modal State
  const [podLogsState, setPodLogsState] = useState({
    open: false,
    content: '',
    loading: false,
    target: null as { namespace: string; pod: string; container: string } | null,
  });

  // Global WebSocket Context
  const { messages, connectToNamespace, subscribeToPodLogs } = useGlobalWebSocket();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t } = useTranslation();

  // --- 1. Namespace Connection Logic (完全復刻 PodTable) ---
  useEffect(() => {
    const connectUserNamespaces = async () => {
      const username = getUsername();
      if (!username || username === 'null') return;

      const userDataStr = localStorage.getItem('userData');
      let projects: Project[] = [];

      try {
        if (userDataStr) {
          // 方法 A: 從 LocalStorage 快取與 UserGroup 推算
          const { user_id: userId } = JSON.parse(userDataStr);
          const [allProjects, userGroups] = await Promise.all([
            getProjects(),
            getGroupsByUser(userId),
          ]);
          const userGroupIds = userGroups.map((g: { GID: any }) => g.GID);
          projects = (allProjects || []).filter((p: Project) => userGroupIds.includes(p.GID));
        } else {
          // 方法 B: 直接呼叫 API
          projects = await getProjectListByUser();
        }

        // 建立連線: 格式通常是 proj-{PID}-{username} 或系統定義的格式
        projects.forEach((p) => {
          // 請確認這裡的 Namespace 格式與您的後端一致
          // 假設格式為: proj-{PID}-{username}
          const ns = `proj-${p.PID}-${username}`;
          connectToNamespace(ns);
        });
      } catch (err) {
        console.error('Job Namespace connection failed:', err);
      }
    };

    connectUserNamespaces();
  }, [connectToNamespace]);

  // --- 2. 核心邏輯：從 Pods 訊息反推 Jobs (Inferred Jobs) ---
  const { jobPodMap, inferredJobs } = useMemo(() => {
    const map: JobPodMap = {};
    const jobs: InferredJob[] = [];

    messages.forEach((m: any) => {
      // 只處理 Pod 類型
      if (m.kind !== 'Pod') return;

      const labels = m?.metadata?.labels || {};
      const ownerRefs = m?.metadata?.ownerReferences || [];

      // 嘗試找出 Job Name (從 Label 或 OwnerReference)
      let jobName = labels['job-name'] || labels['job'];

      if (!jobName && Array.isArray(ownerRefs)) {
        const jobOwner = ownerRefs.find(
          (o: any) => o.name && (o.kind || '').toLowerCase() === 'job',
        );
        if (jobOwner) jobName = jobOwner.name;
      }

      // 如果確認這個 Pod 屬於某個 Job
      if (jobName) {
        if (!map[jobName]) map[jobName] = [];

        // 解析 Pod 資訊
        const podInfo: JobPod = {
          name: m.name,
          namespace: m.ns,
          containers: m.containers || [],
          status: m.status || 'Unknown',
          startTime: m.metadata?.creationTimestamp,
          image: m.containers && m.containers.length > 0 ? 'container-image' : '',
        };

        // 避免重複加入 Map
        if (!map[jobName].find((p) => p.name === m.name)) {
          map[jobName].push(podInfo);
        }
      }
    });

    // 將 Map 轉換為 InferredJob 列表
    Object.keys(map).forEach((jobName) => {
      const pods = map[jobName];
      if (pods.length === 0) return;

      const firstPod = pods[0];

      // 簡單的 Job 狀態判斷邏輯
      let derivedStatus = 'Running';
      if (pods.every((p) => p.status === 'Succeeded' || p.status === 'Completed'))
        derivedStatus = 'Completed';
      else if (pods.some((p) => p.status === 'Failed' || p.status === 'Error'))
        derivedStatus = 'Failed';
      else if (pods.some((p) => p.status === 'Running' || p.status === 'ContainerCreating'))
        derivedStatus = 'Running';
      else derivedStatus = pods[0].status;

      jobs.push({
        name: jobName,
        namespace: firstPod.namespace,
        status: derivedStatus,
        image: firstPod.image || 'Unknown', // 若 WS 沒送 image 資訊，這裡可能需要調整
        createdAt: firstPod.startTime,
        podCount: pods.length,
      });
    });

    // 排序：最新的 Job 排前面
    jobs.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return { jobPodMap: map, inferredJobs: jobs };
  }, [messages]);

  // --- 3. Log 訂閱邏輯 ---
  const handleViewPodLog = useCallback((namespace: string, pod: string, container: string) => {
    setPodLogsState({
      open: true,
      content: '',
      loading: true,
      target: { namespace, pod, container },
    });
  }, []);

  useEffect(() => {
    const { open, target } = podLogsState;
    if (!open || !target) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = subscribeToPodLogs(target.namespace, target.pod, target.container, (line: string) => {
        setPodLogsState((prev) => ({
          ...prev,
          loading: false,
          content: prev.content ? prev.content + '\n' + line : line,
        }));
      });
    } catch (e) {
      setPodLogsState((prev) => ({ ...prev, loading: false, content: `Error: ${String(e)}` }));
    }
    return () => {
      if (unsub) unsub();
    };
  }, [podLogsState.open, podLogsState.target, subscribeToPodLogs]);

  // --- 4. 搜尋與分頁 ---
  const filteredJobs = useMemo(
    () =>
      inferredJobs.filter(
        (j) =>
          j.name.toLowerCase().includes(search.toLowerCase()) ||
          j.namespace.toLowerCase().includes(search.toLowerCase()),
      ),
    [inferredJobs, search],
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const pagedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      <PageBreadcrumb pageTitle={t('page.jobs.title')} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-100 text-violet-600 rounded-lg dark:bg-violet-900/30 dark:text-violet-400">
            <LuActivity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('page.jobs.activeJobsTitle')}
            </h2>
            <p className="text-xs text-gray-500">{t('page.jobs.description')}</p>
          </div>
        </div>

        <div className="w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t('page.jobs.searchPlaceholder')}
          />
        </div>
      </div>

      <JobTable
        jobs={pagedJobs}
        jobPodMap={jobPodMap}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewPodLog={handleViewPodLog}
      />

      <PodLogsModal
        open={podLogsState.open}
        onClose={() => setPodLogsState((prev) => ({ ...prev, open: false }))}
        content={podLogsState.content}
        loading={podLogsState.loading}
        target={podLogsState.target}
      />
    </div>
  );
};

export default JobsLivePage;
