import React, { useState } from 'react';
import { Github, Search, Code2, ExternalLink, Loader2, Rocket, BookOpen, Star, GitFork } from 'lucide-react';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoData, setRepoData] = useState<any>(null);
  const [repoInfo, setRepoInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log("inside")
    try {
      console.log('Sending request to backend with URL:', repoUrl); // Debugging line

      // Send the URL to the backend to clone, install, and run the repo
      const response = await fetch('http://localhost:5000/clone-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }), // Sending the repo URL to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to clone and run the repository');
      }

      // Assuming the backend sends back the repo info and contents data
      const data = await response.json();

      // Set the repo data for display
      setRepoInfo(data.repoInfo);
      setRepoData(data.repoContents);
    } catch (err) {
      setError('Failed to communicate with the backend or invalid repository URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center" />

      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center mb-16">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75"></div>
              <div className="relative bg-gray-900 p-4 rounded-full">
                <Github className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-6xl font-bold mt-8 mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Host Your Project
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-2xl">
              Deploy your GitHub repository instantly. Get your project online in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="Enter your GitHub repository URL"
                  className="w-full pl-12 pr-36 py-6 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      <span>Deploy Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="max-w-3xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm text-red-200 mb-12 flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <ExternalLink className="w-5 h-5" />
              </div>
              {error}
            </div>
          )}

          {repoInfo && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden mb-8">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">{repoInfo.name}</h2>
                    <a
                      href={repoInfo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Github className="w-5 h-5" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">{repoInfo.description}</p>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>{repoInfo.stargazers_count} stars</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                      <GitFork className="w-5 h-5 text-green-400" />
                      <span>{repoInfo.forks_count} forks</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <span>{repoInfo.language}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Repository Files
                  </h3>
                </div>
                <div className="divide-y divide-gray-700/50">
                  {repoData?.map((item: any) => (
                    <div
                      key={item.path}
                      className="p-4 hover:bg-gray-800/50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {item.type === 'dir' ? (
                          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Code2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <Code2 className="w-5 h-5" />
                          </div>
                        )}
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                      <a
                        href={item.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-indigo-400 transition-colors p-2 opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
