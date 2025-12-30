import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  CloudIcon,
  PlayIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';

import { WebSocketContext } from '../../context/WebSocketContext';
import { getUsername } from '../../services/authService';
import {
  openUserDrive,
  stopUserDrive,
  checkUserStorageStatus,
  getUserHubProxyUrl,
} from '../../services/storageService';
import { StatusBadge } from './StorageComponents';

export const PersonalHub: React.FC = () => {
  const { t } = useTranslation();
  const { messages, connectToNamespace } = useContext(WebSocketContext)!;

  const [isRequesting, setIsRequesting] = useState(false);
  const [storageExists, setStorageExists] = useState<boolean | null>(null); // null=loading, false=no pvc, true=ready

  const username = getUsername();
  const safeUsername = username?.toLowerCase() || '';
  const personalNs = `user-${safeUsername}-storage`;
  const podPattern = `filebrowser-pvc-user-${safeUsername}`;

  // 1. Check if Storage Exists on Mount
  useEffect(() => {
    if (safeUsername) {
      connectToNamespace(personalNs);
      checkUserStorageStatus(safeUsername).then(setStorageExists);
    }
  }, [safeUsername, personalNs, connectToNamespace]);

  // 2. Check Pod Status (Running/Pending/Error)
  const personalPod = useMemo(() => {
    return messages.find(
      (m) => m.kind === 'Pod' && m.ns === personalNs && m.name.includes(podPattern),
    );
  }, [messages, personalNs, podPattern]);

  const podExists = !!personalPod;
  const isOnline = personalPod?.status === 'Running' && !personalPod.metadata?.deletionTimestamp;
  const podStatusDetail = personalPod?.status || 'Unknown';

  // --- Handlers ---

  const handleStart = async () => {
    if (isRequesting) return;
    setIsRequesting(true);
    try {
      await openUserDrive();
      toast.success(t('storage.msg.starting'));
      const exists = await checkUserStorageStatus(safeUsername);
      setStorageExists(exists);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || t('common.error'));
    } finally {
      setIsRequesting(false);
    }
  };

  const handleStop = async () => {
    if (isRequesting) return;
    setIsRequesting(true);
    try {
      await stopUserDrive();
      toast.success(t('storage.msg.stopping'));
      const exists = await checkUserStorageStatus(safeUsername);
      setStorageExists(exists);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || t('common.error'));
    } finally {
      setIsRequesting(false);
    }
  };

  // --- Render States ---

  // 1. Loading State
  if (storageExists === null) {
    return (
      <div className="p-12 text-center animate-pulse text-gray-400">{t('common.loading')}</div>
    );
  }

  // 2. No Storage State (Admin hasn't created it yet)
  if (storageExists === false) {
    return (
      <div className="max-w-4xl mx-auto rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <ServerStackIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('storage.personal.noStorageTitle')}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">{t('storage.personal.noStorageDesc')}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm">
          <ExclamationTriangleIcon className="h-4 w-4" />
          {t('storage.personal.contactAdmin')}
        </div>
      </div>
    );
  }

  // 3. Normal State (Storage Exists)
  return (
    <div className="max-w-4xl mx-auto rounded-3xl border border-gray-100 bg-white p-12 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center hover:shadow-md transition-shadow">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        <CloudIcon
          className={`h-12 w-12 ${isOnline ? 'text-green-500' : 'text-blue-500'} transition-colors`}
        />
      </div>

      <h3 className="text-2xl font-black dark:text-white">{t('storage.personal.title')}</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{t('storage.personal.description')}</p>

      <div className="flex flex-col items-center gap-2 mt-6">
        <StatusBadge isOnline={isOnline} />
        {podExists && !isOnline && (
          <span className="text-xs text-amber-500 font-bold animate-pulse">
            {t('common.status')}: {podStatusDetail}
          </span>
        )}
      </div>

      <div className="mt-10 flex justify-center gap-4">
        {!podExists ? (
          <button
            onClick={handleStart}
            disabled={isRequesting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
          >
            {isRequesting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            {t('storage.action.start')}
          </button>
        ) : (
          <>
            <button
              onClick={() => window.open(getUserHubProxyUrl(), '_blank')}
              disabled={!isOnline || isRequesting}
              className={`inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-white transition-all ${
                isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 dark:shadow-none'
                  : 'bg-gray-200 cursor-not-allowed text-gray-500'
              }`}
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" /> {t('storage.action.open')}
            </button>

            <button
              onClick={handleStop}
              disabled={isRequesting}
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-6 py-3.5 font-bold text-red-600 hover:bg-red-100 disabled:opacity-50 transition-all border border-red-100"
            >
              {isRequesting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              ) : (
                <TrashIcon className="h-5 w-5" />
              )}
              {t('storage.action.stop')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
