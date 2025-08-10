// src/components/PVCList.tsx
import React, { useEffect, useState } from "react";
import { getPVCList, PVC } from "../../services/pvcService";

const PVCList: React.FC<{ namespace: string }> = ({ namespace }) => {
  const [pvcs, setPVCs] = useState<PVC | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPVCs = async () => {
      try {
        const data = await getPVCList(namespace);
        setPVCs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchPVCs();
  }, [namespace]);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!pvcs) return <div className="text-gray-500">No PVCs found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">PVCs in Namespace {namespace}</h2>
      <div className="border p-2 rounded">
        <p>Name: {pvcs.name}</p>
        <p>Size: {pvcs.size}</p>
        <p>Status: {pvcs.status}</p>
      </div>
    </div>
  );
};

export default PVCList;