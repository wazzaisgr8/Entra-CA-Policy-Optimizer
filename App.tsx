
import React, { useState, useCallback, useEffect } from 'react';
import { PromptInput } from './components/PromptInput';
import { Dashboard } from './components/Dashboard';
import { PolicyMatrix } from './components/PolicyMatrix';
import { StressTest } from './components/StressTest';
import { Header } from './components/Header';
import { generatePolicies } from './services/geminiService';
import type { GeneratedPolicyResponse } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const initialPrompt = "I need to configure access for my organisation. We have a 'Balanced' risk appetite. I need to make sure my Sales team can access Salesforce from their iPads, but my Developers can only access the Entra Portal if they are using a corporate laptop and a YubiKey. Also, block all traffic from Russia.";
  
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [generatedData, setGeneratedData] = useState<GeneratedPolicyResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt) return;
    setIsLoading(true);
    setError(null);
    setGeneratedData(null);

    try {
      const result = await generatePolicies(currentPrompt);
      setGeneratedData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleGenerate(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial mount

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={() => handleGenerate(prompt)}
              isLoading={isLoading}
            />
        </div>
        
        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {generatedData && !isLoading && (
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-brand-primary tracking-wide">AI Summary & Recommendations</h2>
              <p className="bg-gray-800 p-4 rounded-lg text-gray-300 italic">{generatedData.summary}</p>
            </div>
            <Dashboard dashboardData={generatedData.dashboard} />
            <PolicyMatrix policies={generatedData.matrix} />
            <StressTest scenarios={generatedData.stressTest} />
            <div className="text-center text-gray-500 mt-8">
                <p className="font-bold text-yellow-400">🚨 IMPORTANT:</p>
                <p>Always deploy new policies in "Report-Only" mode for at least 7 days before enforcement.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
