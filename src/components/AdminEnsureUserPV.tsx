import { useState } from 'react';
import axios from 'axios';

export default function AdminEnsureUserPV() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnsure = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/admin/ensure-user-pv');
      setResult(`已補齊 PV/PVC 數量: ${res.data.created}`);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } }; message?: string };
      setResult('補齊失敗: ' + (err.response?.data?.error || err.message || 'unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-2">補齊所有用戶 PV/PVC</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        此操作會為所有尚未建立 PV/PVC 的用戶自動補齊。
      </p>
      <button
        onClick={handleEnsure}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? '執行中...' : '執行補齊'}
      </button>
      {result && <div className="mt-4 text-sm text-green-700 dark:text-green-300">{result}</div>}
    </div>
  );
}
