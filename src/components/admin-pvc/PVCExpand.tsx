import React, { useState } from 'react';
import { useTranslation } from '@tailadmin/utils';

const DEFAULT_NAMESPACES = ['default', 'kube-public'];

const PVCExpand: React.FC = () => {
  const { t } = useTranslation();
  const [namespace, setNamespace] = useState('default');
  const [customNamespace, setCustomNamespace] = useState('');
  const [name, setName] = useState('');
  const [newSize, setNewSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const actualNamespace = namespace === 'custom' ? customNamespace : namespace;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (actualNamespace === 'kube-system') {
      setError(t('admin.pvcExpand.namespaceInvalid'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/k8s/pvc/expand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: new URLSearchParams({
          namespace: actualNamespace,
          name,
          size: newSize,
        }).toString(),
      });
      if (!res.ok) throw new Error(t('admin.pvcExpand.error'));
      setSuccess(t('admin.pvcExpand.success'));
      setName('');
      setNewSize('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="pvc-expand space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold">{t('admin.pvcExpand.title')}</h2>
      <div>
        <label>{t('admin.pvcExpand.namespace')}
          <select
            value={namespace}
            onChange={e => setNamespace(e.target.value)}
            className="ml-2 border px-2 py-1"
          >
            {DEFAULT_NAMESPACES.map(ns => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
            <option value="custom">{t('admin.pvcList.customNamespace')}</option>
          </select>
        </label>
        {namespace === 'custom' && (
          <input
            className="border px-2 py-1 ml-2"
            value={customNamespace}
            onChange={e => setCustomNamespace(e.target.value)}
            placeholder={t('admin.pvcList.namespacePlaceholder')}
            autoFocus
          />
        )}
      </div>
      <div>
        <label>{t('admin.pvcExpand.name')}
          <input
            className="border px-2 py-1 ml-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>{t('admin.pvcExpand.newSize')}
          <input
            className="border px-2 py-1 ml-2"
            value={newSize}
            onChange={e => setNewSize(e.target.value)}
            required
          />
        </label>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button
        type="submit"
        className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? t('admin.pvcExpand.submit') + '...' : t('admin.pvcExpand.submit')}
      </button>
    </form>
  );
};

export default PVCExpand;
