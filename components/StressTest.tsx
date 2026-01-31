import React from 'react';
// FIX: Renamed imported type `StressTest` to `StressTestType` to resolve name collision with the `StressTest` component.
import type { StressTest as StressTestType, StressTestResult } from '../types';

interface StressTestProps {
  scenarios: StressTestType[];
}

const getResultPill = (result: StressTestResult) => {
    switch (result) {
        case 'BLOCKED':
            return <span className="bg-red-500/30 text-red-300 px-3 py-1 text-xs rounded-full font-bold">BLOCKED</span>;
        case 'ALLOWED':
            return <span className="bg-yellow-500/30 text-yellow-300 px-3 py-1 text-xs rounded-full font-bold">ALLOWED</span>;
        case 'MFA':
        case 'MFA / BLOCK':
            return <span className="bg-blue-500/30 text-blue-300 px-3 py-1 text-xs rounded-full font-bold">{result}</span>;
        default:
            return <span className="bg-gray-500/30 text-gray-300 px-3 py-1 text-xs rounded-full font-bold">{result}</span>;
    }
}

export const StressTest: React.FC<StressTestProps> = ({ scenarios }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-primary tracking-wide">🧪 Stress Test Simulation</h2>
      <div className="space-y-4">
        {scenarios.map((scenario, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex-grow mb-3 md:mb-0">
              <p className="font-semibold text-gray-200">
                <span className="text-gray-500 font-bold mr-2">Scenario {String.fromCharCode(65 + index)}:</span> 
                {scenario.scenario}
              </p>
              <p className="text-xs text-gray-400 mt-1 pl-4 border-l-2 border-gray-600">
                <span className="font-bold">AI Rationale:</span> {scenario.explanation}
              </p>
            </div>
            <div className="md:ml-4 flex-shrink-0">
              {getResultPill(scenario.result)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};