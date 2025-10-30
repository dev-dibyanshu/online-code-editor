interface ExecutionResult {
  output: string;
  error: string;
  executionTime: number;
}

interface LanguageConfig {
  language: string;
  version: string;
}
6
const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

const languageMap: Record<string, LanguageConfig> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'c++', version: '10.2.0' },
};

export const executeCode = async (
  language: 'javascript' | 'python' | 'cpp',
  code: string
): Promise<ExecutionResult> => {
  const startTime = performance.now();

  try {
    const config = languageMap[language];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const response = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [
          {
            name: `main.${language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}`,
            content: code,
          },
        ],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 10000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    let output = '';
    let error = '';

    if (result.run) {
      output = result.run.stdout || '';
      error = result.run.stderr || '';

      if (result.run.code !== 0 && !error) {
        error = `Process exited with code ${result.run.code}`;
      }
    }

    if (result.compile && result.compile.code !== 0) {
      error = result.compile.stderr || result.compile.output || 'Compilation failed';
    }

    return {
      output,
      error,
      executionTime,
    };
  } catch (err) {
    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    return {
      output: '',
      error: err instanceof Error ? err.message : 'An unknown error occurred',
      executionTime,
    };
  }
};

export const getSupportedLanguages = () => {
  return Object.keys(languageMap);
};
