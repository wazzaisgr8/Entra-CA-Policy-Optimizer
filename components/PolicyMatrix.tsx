
import React from 'react';
import type { Policy } from '../types';

interface PolicyMatrixProps {
  policies: Policy[];
}

export const PolicyMatrix: React.FC<PolicyMatrixProps> = ({ policies }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-primary tracking-wide">🏗️ The Configuration Matrix</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 w-1/12">ID</th>
              <th scope="col" className="px-6 py-3 w-3/12">Name</th>
              <th scope="col" className="px-6 py-3 w-2/12">Users (Inc/Exc)</th>
              <th scope="col" className="px-6 py-3 w-2/12">Apps</th>
              <th scope="col" className="px-6 py-3 w-2/12">Conditions</th>
              <th scope="col" className="px-6 py-3 w-2/12">Grant Control</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.policyId} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-6 py-4 font-mono text-brand-secondary font-bold">{policy.policyId}</td>
                <td className="px-6 py-4 font-semibold">{policy.name}</td>
                <td className="px-6 py-4">{policy.users}</td>
                <td className="px-6 py-4">{policy.apps}</td>
                <td className="px-6 py-4">{policy.conditions}</td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${policy.grantControl.toLowerCase().includes('block') ? 'text-red-400' : 'text-green-400'}`}>
                    {policy.grantControl}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
