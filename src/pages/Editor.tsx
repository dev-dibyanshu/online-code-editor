import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Navbar } from '../components/Navbar';
import { OutputConsole } from '../components/OutputConsole';
import { SaveModal } from '../components/SaveModal';
import { FileList } from '../components/FileList';
import { executeCode } from '../services/codeExecutionService';
import { saveCodeFile, getCodeFiles, deleteCodeFile } from '../services/codeStorageService';
import { CodeFile } from '../lib/supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultCode = {
  javascript: `console.log("Hello, World!");

const sum = (a, b) => a + b;
console.log("Sum:", sum(5, 3));`,
  python: `print("Hello, World!")

def sum(a, b):
    return a + b

print("Sum:", sum(5, 3))`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;

    int a = 5, b = 3;
    cout << "Sum: " << (a + b) << endl;

    return 0;
}`,
};

export const Editor = () => {
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const { data, error } = await getCodeFiles();
    if (error) {
      toast.error('Failed to load files');
    } else if (data) {
      setFiles(data);
    }
  };

  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'cpp') => {
    setLanguage(newLang);
    if (!selectedFileId) {
      setCode(defaultCode[newLang]);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    setIsConsoleExpanded(true);

    const result = await executeCode(language, code);

    setOutput(result.output);
    setError(result.error);
    setExecutionTime(result.executionTime);
    setIsRunning(false);

    if (result.error) {
      toast.error('Code execution failed');
    } else {
      toast.success('Code executed successfully');
    }
  };

  const handleSaveCode = () => {
    setIsSaveModalOpen(true);
  };

  const handleSaveConfirm = async (fileName: string) => {
    const { data, error } = await saveCodeFile(fileName, language, code);

    if (error) {
      toast.error('Failed to save file');
    } else {
      toast.success('File saved successfully');
      setIsSaveModalOpen(false);
      await loadFiles();
      if (data) {
        setSelectedFileId(data.id);
      }
    }
  };

  const handleFileSelect = (file: CodeFile) => {
    setCode(file.code);
    setLanguage(file.language);
    setSelectedFileId(file.id);
    setOutput('');
    setError('');
    setExecutionTime(null);
    toast.info(`Loaded: ${file.file_name}`);
  };

  const handleFileDelete = async (id: string) => {
    const { error } = await deleteCodeFile(id);

    if (error) {
      toast.error('Failed to delete file');
    } else {
      toast.success('File deleted successfully');
      if (selectedFileId === id) {
        setSelectedFileId(null);
        setCode(defaultCode[language]);
      }
      await loadFiles();
    }
  };

  const handleClearOutput = () => {
    setOutput('');
    setError('');
    setExecutionTime(null);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        onSaveCode={handleSaveCode}
        isRunning={isRunning}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      <div className="flex-1 flex overflow-hidden">
        <FileList
          files={files}
          onFileSelect={handleFileSelect}
          onFileDelete={handleFileDelete}
          selectedFileId={selectedFileId}
        />

        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          <OutputConsole
            output={output}
            error={error}
            executionTime={executionTime}
            isExpanded={isConsoleExpanded}
            onToggle={() => setIsConsoleExpanded(!isConsoleExpanded)}
            onClear={handleClearOutput}
          />
        </div>
      </div>

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveConfirm}
        language={language}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
};
