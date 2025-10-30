import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Code2, LogOut, User, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  language: 'javascript' | 'python' | 'cpp';
  onLanguageChange: (lang: 'javascript' | 'python' | 'cpp') => void;
  onRunCode: () => void;
  onSaveCode: () => void;
  isRunning: boolean;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const Navbar = ({
  language,
  onLanguageChange,
  onRunCode,
  onSaveCode,
  isRunning,
  theme,
  onThemeToggle,
}: NavbarProps) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-white">CodeEditor</span>
          </div>

          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as 'javascript' | 'python' | 'cpp')}
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={onSaveCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Save Code
          </button>

          <button
            onClick={onThemeToggle}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>{username}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-600 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
