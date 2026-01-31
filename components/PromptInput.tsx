
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  return (
    <div>
        <label htmlFor="prompt-input" className="block text-lg font-semibold mb-2 text-gray-300">
          Describe your access control requirements:
        </label>
        <textarea
            id="prompt-input"
            rows={5}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 resize-y"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Allow Marketing to use Office 365 from trusted locations, but require MFA from anywhere else...'"
            disabled={isLoading}
        />
        <div className="mt-4 flex justify-end">
            <button
                onClick={onGenerate}
                disabled={isLoading || !prompt}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-md hover:bg-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center"
            >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : 'Optimize Policies'}
            </button>
        </div>
    </div>
  );
};
