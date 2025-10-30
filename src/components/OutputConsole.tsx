import { Terminal, ChevronDown, ChevronUp, X } from 'lucide-react';

interface OutputConsoleProps {
  output: string;
  error: string;
  executionTime: number | null;
  isExpanded: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const OutputConsole = ({
  output,
  error,
  executionTime,
  isExpanded,
  onToggle,
  onClear,
}: OutputConsoleProps) => {
  const hasContent = output || error;

  return (
    <div
      className={`bg-slate-800 border-t border-slate-700 transition-all duration-300 ${
        isExpanded ? 'h-80' : 'h-12'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Output Console</span>
          {executionTime !== null && (
            <span className="text-xs text-slate-500">
              (Executed in {executionTime}ms)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasContent && (
            <button
              onClick={onClear}
              className="text-slate-400 hover:text-slate-300 transition-colors"
              title="Clear output"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="h-[calc(100%-40px)] overflow-y-auto p-4">
          {!hasContent ? (
            <div className="text-slate-500 text-sm">
              No output yet. Run your code to see results here.
            </div>
          ) : (
            <div className="font-mono text-sm">
              {output && (
                <pre className="text-green-400 whitespace-pre-wrap break-words">{output}</pre>
              )}
              {error && (
                <pre className="text-red-400 whitespace-pre-wrap break-words mt-2">{error}</pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
