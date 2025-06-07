// src/pages/apps/LeaderboardPage/LeaderboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Leaf, Users, Globe, MapPin, Award, Zap } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import type { LeaderboardEntry } from './leaderBoard';
import { mockLeaderboardData, availableZones } from './leaderBoard';

const LeaderboardPage: React.FC = () => {
  const { view } = useParams<{ view?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateCards, setAnimateCards] = useState(false);

  // Get active view for consistent state management
  const activeView = view || 'global';

  // Simulate async data fetch
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setAnimateCards(false);
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data =
          view && view !== 'global'
            ? mockLeaderboardData.zones[view] || []
            : mockLeaderboardData.global;
        setLeaderboardData(data);
        
        // Trigger card animations after data loads
        setTimeout(() => setAnimateCards(true), 100);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view, isAuthenticated]);

  const handleViewChange = (newView: string) => {
    navigate(`/app/leaderboard/${newView}`);
  };

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return (
        <div className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-emerald-600">
          #{rank}
        </div>
      );
    }
  };

  const getZoneDisplay = (zone: string) => {
    return zone.split('_')[1]?.toUpperCase() || zone;
  };

  if (!isAuthenticated) return null; // Handled by ProtectedRoute

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Eco Champions</h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Leading the way towards a cleaner, greener tomorrow through community action
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1.5 shadow-lg border border-gray-100 inline-flex flex-wrap gap-1">
            <button
              onClick={() => handleViewChange('global')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeView === 'global'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              Global
            </button>
            {availableZones.map((zone) => (
              <button
                key={zone}
                onClick={() => handleViewChange(zone)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === zone
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Zone {getZoneDisplay(zone)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Champions</p>
                <p className="text-2xl font-bold text-gray-800">{leaderboardData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Impact Points</p>
                <p className="text-2xl font-bold text-gray-800">
                  {leaderboardData.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Leader</p>
                <p className="text-xl font-bold text-gray-800">
                  {leaderboardData[0]?.name || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-emerald-600">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
              <span className="font-medium">Loading champions...</span>
            </div>
          </div>
        )}

        {/* Leaderboard Cards */}
        {!loading && (
          <div className="space-y-3">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.userId}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform ${
                  animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${entry.rank <= 3 ? 'ring-2 ring-emerald-100' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{entry.name}</h3>
                      <p className="text-sm text-gray-500">Rank #{entry.rank}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      <span className="text-2xl font-bold text-emerald-600">
                        {entry.points.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">eco points</p>
                  </div>
                </div>
                
                {/* Progress bar for top 3 */}
                {entry.rank <= 3 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min((entry.points / (leaderboardData[0]?.points || 1)) * 100, 100)}%`,
                          transitionDelay: `${(index + 1) * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {leaderboardData.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Leaf className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <p className="text-gray-500 font-medium">No champions found</p>
                <p className="text-sm text-gray-400">Be the first to make an impact!</p>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Join the Movement!</h3>
            <p className="text-emerald-100 mb-4">
              Every small action counts towards a cleaner environment
            </p>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-300">
              Start Contributing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;