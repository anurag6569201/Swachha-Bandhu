import React, { useState } from 'react';
import { fetchLeaderboard } from '../services/api';
import { useApi } from '../hooks/useApi';
import type { LeaderboardUser } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal, UserCircle, Users } from 'lucide-react';

interface LeaderboardProps {
    currentUserId: string | null;
}

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
    if (rank === 1) return <Crown className="text-amber-500" size={28} strokeWidth={2.5} />;
    if (rank === 2) return <Medal className="text-slate-400" size={24} strokeWidth={2} />;
    if (rank === 3) return <Medal className="text-amber-700" size={24} strokeWidth={2} />;
    return <span className="font-bold text-slate-500 text-lg w-7 text-center">{rank}</span>;
};

const LeaderboardRow: React.FC<{ user: LeaderboardUser, isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
    return (
        <div className={`flex items-center p-3 rounded-lg transition-all duration-300 relative
            ${isCurrentUser 
                ? 'bg-teal-100/70 border border-teal-200 scale-105 shadow-md' 
                : 'border border-transparent hover:bg-slate-100'
            }`}
        >
            <div className="w-12 flex-shrink-0 text-center flex items-center justify-center">
                <RankIcon rank={user.rank} />
            </div>
            <div className="flex-grow flex items-center mx-4 gap-3">
                <UserCircle className="text-3xl text-slate-400 flex-shrink-0" />
                <span className="font-medium text-slate-700 truncate">{user.full_name}{isCurrentUser && " (You)"}</span>
            </div>
            <div className="font-bold text-lg text-teal-600 flex-shrink-0">
                {user.total_points.toLocaleString()}
                <span className="text-xs text-slate-500 ml-1">pts</span>
            </div>
        </div>
    );
};

const LeaderboardSkeleton: React.FC = () => (
    <div className="space-y-2">
      {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center p-3 rounded-lg bg-slate-200/60 animate-pulse">
              <div className="w-12 h-7 bg-slate-300 rounded-md"></div>
              <div className="flex-grow flex items-center mx-4 gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-300"></div>
                  <div className="h-5 flex-grow bg-slate-300 rounded-md"></div>
              </div>
              <div className="h-6 w-20 bg-slate-300 rounded-md"></div>
          </div>
      ))}
    </div>
);


export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [period, setPeriod] = useState<'monthly' | 'all_time'>('all_time');
  const { data: users, isLoading, error } = useApi(() => fetchLeaderboard(period), [period]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } }
  };
  
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <div className="flex items-center gap-3">
            <Users className="text-teal-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Leaderboard</h2>
        </div>
        <div className="relative flex mt-3 bg-slate-200 rounded-full border border-slate-300/70" style={{padding:'0'}}>
            { (['all_time', 'monthly'] as const).map(p => (
                <button 
                    key={p} 
                    onClick={() => setPeriod(p)} 
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full relative z-10 transition-colors duration-300
                        ${period === p ? 'text-white' : 'text-slate-600 hover:text-slate-800'}`
                    }
                >
                    {p === 'all_time' ? 'All Time' : 'This Month'}
                </button>
            ))}
            <motion.div
                layoutId="leaderboard-active-pill"
                className="absolute inset-0 bg-teal-600 rounded-full z-0"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    left: period === 'all_time' ? '0.25rem' : 'calc(50% - 0.125rem)',
                    right: period === 'monthly' ? '0.25rem' : 'calc(50% - 0.125rem)',
                }}
            />
        </div>
      </div>
      <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {isLoading && <LeaderboardSkeleton />}
        {error && <p className="text-red-600 text-center p-4">{error}</p>}
        <AnimatePresence>
            <motion.div variants={listVariants} initial="hidden" animate="visible">
                {users && users.map(user => (
                    <motion.div key={user.id} variants={itemVariants}>
                        <LeaderboardRow user={user} isCurrentUser={user.id === currentUserId} />
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
        {!isLoading && users?.length === 0 && <p className="text-slate-500 text-center p-4">No rankings yet. Be the first!</p>}
      </div>
    </div>
  );
};