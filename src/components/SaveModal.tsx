import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileName: string) => void;
  language: 'javascript' | 'python' | 'cpp';
  initialFileName?: string;
}

export const SaveModal = ({ isOpen, onClose, onSave, language, initialFileName = '' }: SaveModalProps) => {
  const [fileName, setFileName] = useState(initialFileName);

  const languageLabels = {
    javascript: 'JavaScript',
    python: 'Python',
    cpp: 'C++',
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fileName.trim()) {
      onSave(fileName.trim());
      setFileName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Save Code File</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-slate-300 mb-2">
              File Name
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., my-program"
              required
              autoFocus
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Language
            </label>
            <div className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
              {languageLabels[language]}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
