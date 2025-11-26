import React, { useState } from 'react';
import { Loader2, Search, Crown, Target, Sword, Users, Award } from 'lucide-react';
import { useFortniteApi } from '../hooks/useFortniteApi';
import type { PlayerStats } from '../types/fortnitedto';

function StatBox({ label, value, icon: Icon }: { label: string; value: string | number, icon?: any }) {
  return (
    <div className="border p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-sm mb-1">
        {Icon && <Icon size={14} />}
        <span>{label}</span>
      </div>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}

export default function PlayerSearch() {
  const [playerName, setPlayerName] = useState('');
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const { data, loading, error } = useFortniteApi<PlayerStats>(
    '/v2/stats/br/v2',
    searchQuery ? { name: searchQuery } : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setSearchQuery(playerName.trim());
    }
  };

  const isSearching = loading || (searchQuery && !data && !error);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Fortnite Stats
        </h1>
        <p className="text-gray-600">Enter username to search</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Username..."
            className="w-full pl-8 pr-4 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !playerName.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
        >
          {isSearching ? <Loader2 className="animate-spin h-4 w-4" /> : 'Search'}
        </button>
      </form>

      <div className="min-h-[200px]">
        {isSearching && (
          <div className="text-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p>Loading...</p>
          </div>
        )}

        {error && !isSearching && (
          <div className="border border-red-300 rounded p-4 text-center max-w-md mx-auto">
            <h3 className="text-red-800 font-semibold mb-2">Player Not Found</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {data && !isSearching && !error && (
          <div>
            <div className="border rounded mb-4 p-4">
              <div className="flex items-center gap-4 mb-4">
                {data.image ? (
                  <img 
                    src={data.image} 
                    alt={data.account.name} 
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                    {data.account.name[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{data.account.name}</h2>
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    Level {data.battlePass?.level || 0}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <StatBox label="Wins" value={data.stats.all.overall.wins} icon={Crown} />
                <StatBox label="Win %" value={`${data.stats.all.overall.winRate.toFixed(1)}%`} icon={Target} />
                <StatBox label="Kills" value={data.stats.all.overall.kills} icon={Sword} />
                <StatBox label="K/D" value={data.stats.all.overall.kd.toFixed(2)} icon={Award} />
                <StatBox label="Matches" value={data.stats.all.overall.matches} icon={Users} />
                <StatBox label="Score" value={data.stats.all.overall.score} icon={Target} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}