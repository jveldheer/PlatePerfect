import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Configure your Fuel Generator settings
          </p>
        </div>

        {/* OpenAI API Key Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🤖 AI Configuration
          </h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Get true AI-generated meals!</strong> Enter your OpenAI API key to unlock GPT-4 powered meal generation with unlimited creativity.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                💾 Save API Key
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-all"
              >
                Clear
              </button>
            </div>

            {saved && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ API key saved successfully! Your Fuel Generator will now use AI-powered meal generation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How to Get an API Key */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📖 How to Get an OpenAI API Key
          </h2>

          <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
            <li>
              Go to{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                platform.openai.com/api-keys
              </a>
            </li>
            <li>Sign in or create an OpenAI account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy the key (it starts with "sk-")</li>
            <li>Paste it above and click "Save API Key"</li>
          </ol>

          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> OpenAI API usage is pay-as-you-go. Each meal generation costs approximately $0.02-0.05. Check OpenAI's pricing for current rates.
            </p>
          </div>
        </div>

        {/* Back to Fuel Generator */}
        <div className="text-center">
          <Link
            to="/meal-generator"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md"
          >
            ← Back to Fuel Generator
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Settings;
