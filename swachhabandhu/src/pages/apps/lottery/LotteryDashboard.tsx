import React from 'react';
import { motion } from 'framer-motion';
import { MyStats } from './components/MyStats';
import { Leaderboard } from './components/Leaderboard';
import { LotterySection } from './components/LotterySection';
import { useApi } from './hooks/useApi';
import { fetchUserProfileStats } from './services/api';
import { Award } from 'lucide-react';

export default function GamificationDashboard() {
  const { data: userStats, isLoading: isLoadingStats, error: statsError } = useApi(fetchUserProfileStats);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  return (
    <div className="mt-20 bg-slate-50 text-slate-800 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]">
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10"
        >
          <div className="inline-flex items-center justify-center gap-3">
              <Award className="text-amber-500" size={40} strokeWidth={2.5}/>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
                Rewards & Recognition
              </h1>
          </div>
          <p className="m-0 p-0">
            Your contributions are valuable. Track your progress, climb the ranks, and win exciting prizes.
          </p>
        </motion.div>

        {statsError && (
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center py-4 px-6 bg-red-100 rounded-lg shadow-lg border border-red-200">
                <h3 className="text-base font-semibold text-red-800">Could not load your profile stats</h3>
                <p className="text-red-700 text-sm mt-1">{statsError}</p>
            </motion.div>
        )}

        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <div className="xl:col-span-1 space-y-3">
                <motion.div variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}>
                    <MyStats stats={userStats} isLoading={isLoadingStats} />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}>
                    <Leaderboard currentUserId={userStats?.id ?? null} />
                </motion.div>
            </div>

            <div className="xl:col-span-2">
                 <motion.div variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}>
                    <LotterySection />
                </motion.div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}