import React, { useEffect, useState } from 'react';
import { useTranslation } from '@tailadmin/utils';

interface PVC {
  name: string;
  namespace: string;
  status: string;
  size: string;
}

const DEFAULT_NAMESPACES = ['default', 'kube-system', 'kube-public'];

const PVCList: React.FC = () => {
  const { t } = useTranslation();
  const [namespace, setNamespace] = useState('default');
  const [pvcs, setPvcs] = useState<PVC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!namespace) return;
    setLoading(true);
    setError(null);
    fetch(`/k8s/pvc/list/${namespace}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(t('admin.pvcList.fetchError'));
        return res.json();
      })
      .then((data) => setPvcs(data.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [namespace, t]);

  return (
    <div className="pvc-list">
      <h2 className="text-lg font-bold mb-2">{t('admin.pvcList.title')}</h2>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="namespace-select">{t('admin.pvcList.namespace')}</label>
        <select
          id="namespace-select"
          value={namespace}
          onChange={e => setNamespace(e.target.value)}
        >
          {DEFAULT_NAMESPACES.map(ns => (
            <option key={ns} value={ns}>{ns}</option>
          ))}
          <option value="custom">{t('admin.pvcList.customNamespace')}</option>
        </select>
        {namespace === 'custom' && (
          <input
            className="border px-2 py-1 ml-2"
            value={namespace === 'custom' ? '' : namespace}
            onChange={e => setNamespace(e.target.value)}
            placeholder={t('admin.pvcList.namespacePlaceholder')}
            autoFocus
          />
        )}
      </div>
      {loading && <div>{t('admin.pvcList.loading')}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">{t('admin.pvcList.name')}</th>
            <th className="border px-2 py-1">{t('admin.pvcList.namespace')}</th>
            <th className="border px-2 py-1">{t('admin.pvcList.status')}</th>
            <th className="border px-2 py-1">{t('admin.pvcList.size')}</th>
          </tr>
        </thead>
        <tbody>
          {pvcs.length === 0 && !loading && !error && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-2">
                {t('admin.pvcList.noData')}
              </td>
            </tr>
          )}
          {pvcs.map((pvc) => (
            <tr key={pvc.name}>
              <td className="border px-2 py-1">{pvc.name}</td>
              <td className="border px-2 py-1">{pvc.namespace}</td>
              <td className="border px-2 py-1">{pvc.status}</td>
              <td className="border px-2 py-1">{pvc.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PVCList;
