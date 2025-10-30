import { useState } from 'react';
import { CodeFile } from '../lib/supabase';
import { File, Trash2, FileCode, ChevronLeft, ChevronRight } from 'lucide-react';

interface FileListProps {
  files: CodeFile[];
  onFileSelect: (file: CodeFile) => void;
  onFileDelete: (id: string) => void;
  selectedFileId: string | null;
}

export const FileList = ({ files, onFileSelect, onFileDelete, selectedFileId }: FileListProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = (id: string) => {
    onFileDelete(id);
    setDeleteConfirmId(null);
  };

  const getLanguageIcon = (language: string) => {
    const colors = {
      javascript: 'text-yellow-400',
      python: 'text-blue-400',
      cpp: 'text-purple-400',
    };
    return colors[language as keyof typeof colors] || 'text-slate-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="text-slate-400 hover:text-slate-300 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <FileCode className="h-5 w-5 text-slate-400" />
          <span className="font-semibold text-white text-sm">My Files</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-slate-400 hover:text-slate-300 transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            No saved files yet. Save your code to see it here.
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={`group relative rounded-lg transition-colors ${
                  selectedFileId === file.id
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <button
                  onClick={() => onFileSelect(file)}
                  className="w-full text-left p-3 flex items-start space-x-3"
                >
                  <File className={`h-4 w-4 mt-0.5 flex-shrink-0 ${getLanguageIcon(file.language)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {file.file_name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {file.language} • {formatDate(file.updated_at)}
                    </div>
                  </div>
                </button>

                {deleteConfirmId === file.id ? (
                  <div className="absolute right-2 top-2 flex items-center space-x-1 bg-slate-800 rounded px-2 py-1">
                    <button
                      onClick={() => handleConfirmDelete(file.id)}
                      className="text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      Delete
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs text-slate-400 hover:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(file.id)}
                    className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
