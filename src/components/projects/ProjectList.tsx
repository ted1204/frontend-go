// src/components/ProjectList.tsx
import React, { useEffect, useState } from "react";
import { getProjects, Project } from "../../services/projectService";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.PID} className="border p-2 rounded">
            {project.ProjectName} (ID: {project.PID}, Group: {project.PID})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;