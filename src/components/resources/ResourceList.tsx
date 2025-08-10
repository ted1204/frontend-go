// src/components/ResourceList.tsx
import React, { useEffect, useState } from "react";
import { getResourceById, Resource } from "../../services/resourceService";

const ResourceDetail: React.FC<{ resourceId: number }> = ({ resourceId }) => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResourceById(resourceId);
        setResource(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [resourceId]);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!resource) return <div className="text-gray-500">No resource found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resource Detail (ID: {resource.r_id})</h2>
      <div className="border p-2 rounded">
        <p>Name: {resource.name}</p>
        <p>Type: {resource.type}</p>
        <p>Description: {resource.description || "N/A"}</p>
      </div>
    </div>
  );
};

export default ResourceDetail;