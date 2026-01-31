
import React from 'react';
import type { DashboardMetric } from '../types';

interface DashboardProps {
  dashboardData: DashboardMetric[];
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'high':
        case 'low': // For user friction
            return 'bg-green-500/20 text-green-300';
        case 'medium':
        case 'balanced':
            return 'bg-yellow-500/20 text-yellow-300';
        case 'low': // For security posture
        case 'high': // For user friction
            return 'bg-red-500/20 text-red-300';
        default:
            return 'bg-gray-500/20 text-gray-300';
    }
}

export const Dashboard: React.FC<DashboardProps> = ({ dashboardData }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-primary tracking-wide">🛡️ Policy Health Dashboard</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Metric</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">AI Assessment</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((item, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4 font-semibold">{item.metric}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.assessment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
