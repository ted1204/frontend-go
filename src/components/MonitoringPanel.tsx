import React from "react";
import { ResourceMessage } from "../hooks/useWebSocket"; // 導入介面

const MonitoringPanel = ({ messages }: { messages: ResourceMessage[] }) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <h5 className="text-md font-semibold text-gray-800">Resource Monitoring</h5>
      <table className="w-full mt-2 text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-2 text-left">Event Type</th>
            <th className="p-2 text-left">Kind</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="p-2">{msg.type}</td>
                <td className="p-2">{msg.kind || "N/A"}</td>
                <td className="p-2">{msg.name}</td>
                <td className="p-2">{msg.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                No resources monitored
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonitoringPanel;