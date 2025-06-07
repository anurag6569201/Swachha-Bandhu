// src/pages/apps/LeaderboardPage/LeaderboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Leaf,
  Users,
  Globe,
  MapPin,
  Award,
  Zap,
  Share2,
  Clock,
  ArrowLeft,
} from 'lucide-react';
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
  const [isHindi, setIsHindi] = useState(false);

  const activeView = view || 'global';

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setAnimateCards(false);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data =
          view && view !== 'global'
            ? mockLeaderboardData.zones[view] || []
            : mockLeaderboardData.global;
        setLeaderboardData(data);
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

  // Add a back to dashboard button
 const handleBackToDashboard = () => {
  navigate('/app/dashboard');
};

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-emerald-600">
            #{rank}
          </div>
        );
    }
  };

  const getZoneDisplay = (zone: string) => {
    return zone.split('_')[1]?.toUpperCase() || zone;
  };

  const getContributionSummary = (actions: LeaderboardEntry['actions']) => {
    const waste = actions
      .filter((a) => ['waste_collection', 'recycling'].includes(a.actionType))
      .reduce((sum, a) => sum + a.quantity, 0);
    const events = actions.filter((a) => a.actionType === 'event_participation').reduce((sum, a) => sum + a.quantity, 0);
    const referrals = actions.filter((a) => a.actionType === 'referral').reduce((sum, a) => sum + a.quantity, 0);
    return { waste, events, referrals };
  };

  const getBadges = (entry: LeaderboardEntry) => {
    const badges = [];
    if (entry.points >= 1000) badges.push('Waste Warrior');
    if (entry.actions.some((a) => a.actionType === 'event_participation')) badges.push('Event Enthusiast');
    if (entry.actions.some((a) => a.actionType === 'referral')) badges.push('Community Builder');
    return badges;
  };

  if (!isAuthenticated) return null;

  const translations = {
    en: {
      title: 'Swachh Sevak',
      subtitle: 'Leading the way towards a cleaner, greener tomorrow through community action',
      global: 'Global',
      zone: 'Zone',
      activeChampions: 'Active Champions',
      totalImpact: 'Total Impact Points',
      currentLeader: 'Current Leader',
      join: 'Join the Movement!',
      ctaText: 'Every small action counts towards a cleaner environment',
      ctaButton: 'Start Contributing',
      noChampions: 'No champions found',
      encourage: 'Be the first to make an impact!',
      share: 'Share Your Rank',
    },
    hi: {
      title: 'स्वच्छ सेवाक',
      subtitle: 'सामुदायिक कार्रवाई के माध्यम से स्वच्छ और हरे भविष्य की ओर अग्रसर',
      global: 'वैश्विक',
      zone: 'क्षेत्र',
      activeChampions: 'सक्रिय चैंपियंस',
      totalImpact: 'कुल प्रभाव बिंदु',
      currentLeader: 'वर्तमान नेता',
      join: 'आंदोलन में शामिल हों!',
      ctaText: 'हर छोटा कदम स्वच्छ पर्यावरण की ओर ले जाता है',
      ctaButton: 'योगदान शुरू करें',
      noChampions: 'कोई चैंपियन नहीं मिला',
      encourage: 'पहला प्रभाव डालने वाले बनें!',
      share: 'अपना रैंक साझा करें',
    },
  };

  const t = (key: keyof typeof translations.en) => translations[isHindi ? 'hi' : 'en'][key];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
  <div className="max-w-4xl mx-auto px-4 py-8">
    {/* Back button */}
    <div className="mb-6">
      <button
        onClick={handleBackToDashboard}
        className="text-emerald-600 hover:text-emerald-800 flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
    
        </div>

        {/* Header with Language Toggle */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="ml-4 text-sm text-emerald-600 hover:text-emerald-800"
            >
              {isHindi ? 'EN' : 'हिंदी'}
            </button>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">{t('subtitle')}</p>
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
              {t('global')}
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
                {t('zone')} {getZoneDisplay(zone)}
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
                <p className="text-sm text-gray-600">{t('activeChampions')}</p>
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
                <p className="text-sm text-gray-600">{t('totalImpact')}</p>
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
                <p className="text-sm text-gray-600">{t('currentLeader')}</p>
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full"
              />
              <span className="font-medium">Loading champions...</span>
            </div>
          </div>
        )}

        {/* Leaderboard Cards */}
        {!loading && (
          <div className="space-y-3">
            <AnimatePresence>
              {leaderboardData.map((entry, index) => {
                const { waste, events, referrals } = getContributionSummary(entry.actions);
                const badges = getBadges(entry);
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: animateCards ? 1 : 0, y: animateCards ? 0 : 20 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 ${
                      entry.rank <= 3 ? 'ring-2 ring-emerald-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{entry.name}</h3>
                          <p className="text-sm text-gray-500">
                            {entry.city} | Rank #{entry.rank}
                          </p>
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
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        {waste > 0 ? `${waste} kg waste collected/recycled` : ''}
                        {waste > 0 && (events > 0 || referrals > 0) ? ' • ' : ''}
                        {events > 0 ? `${events} event${events > 1 ? 's' : ''} attended` : ''}
                        {(waste > 0 || events > 0) && referrals > 0 ? ' • ' : ''}
                        {referrals > 0 ? `${referrals} referral${referrals > 1 ? 's' : ''}` : ''}
                      </p>
                      {badges.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {badges.map((badge) => (
                            <span
                              key={badge}
                              className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {entry.rank <= 3 && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((entry.points / (leaderboardData[0]?.points || 1)) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: (index + 1) * 0.2 }}
                            className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        alert(`Share your rank: ${entry.name} - Rank #${entry.rank} with ${entry.points} eco points!`)
                      }
                      className="mt-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-800 text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      {t('share')}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {leaderboardData.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <div className="mb-4">
                  <Leaf className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <p className="text-gray-500 font-medium">{t('noChampions')}</p>
                <p className="text-sm text-gray-400">{t('encourage')}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Challenge Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">{t('join')}</h3>
            <p className="text-emerald-100 mb-4">{t('ctaText')}</p>
            <div className="flex justify-center items-center gap-4 mb-4">
              <Clock className="w-5 h-5" />
              <p className="text-sm">Challenge ends in: 7 days</p>
            </div>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-300">
              {t('ctaButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;