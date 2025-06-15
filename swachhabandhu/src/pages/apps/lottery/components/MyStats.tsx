import React from 'react';
import type { UserProfileStats } from '../types';
import { BadgeList } from './BadgeList';
import { AnimatePresence, motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Star, Trophy, User } from 'lucide-react';

interface MyStatsProps {
  stats: UserProfileStats | null;
  isLoading: boolean;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; gradient: string; isNumber?: boolean }> = ({ icon, label, value, gradient, isNumber = false }) => (
  <motion.div 
    className={`relative p-5 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${gradient}`}
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/30 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white/90">{label}</p>
        {isNumber && typeof value === 'number' ? (
          <CountUp
              end={value}
              duration={2.5}
              separator=","
              className="text-3xl font-bold text-white"
          />
        ) : (
           <p className="text-3xl font-bold text-white">{value}</p>
        )}
      </div>
    </div>
  </motion.div>
);

const SkeletonStatCard: React.FC = () => (
    <div className="p-5 rounded-xl bg-gray-200 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gray-300"></div>
            <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
                <div className="h-6 w-12 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
)

export const MyStats: React.FC<MyStatsProps> = ({ stats, isLoading }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-teal-600" size={24} />
        <h2 className="text-xl font-bold text-slate-800">My Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <AnimatePresence>
          {isLoading ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
          ) : (
            stats && (
              <>
                <StatCard icon={<Star size={24} className="text-white"/>} label="Total Points" value={stats.total_points} gradient="bg-gradient-to-br from-amber-500 to-yellow-500" isNumber />
                <StatCard icon={<Trophy size={24} className="text-white"/>} label="Global Rank" value={stats.rank ? `#${stats.rank}` : 'N/A'} gradient="bg-gradient-to-br from-teal-700 to-teal-500" />
              </>
            )
          )}
        </AnimatePresence>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">My Achievements</h3>
        <BadgeList badges={stats?.earned_badges ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
};