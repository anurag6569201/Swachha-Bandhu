// components/LotterySection.tsx

import React, { useState, useMemo } from 'react';
import { fetchLotteries } from '../services/api';
import { useApi } from '../hooks/useApi';
import { motion } from 'framer-motion';
import { Ticket, Trophy, HelpCircle, Gift, History } from 'lucide-react';
import { LotteryCard } from './LotteryCard';
import { RulesModal } from './RulesModal'; 

export const LotterySection: React.FC = () => {
    const { data: lotteries, isLoading, error } = useApi(fetchLotteries);
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

    const { activeLotteries, pastLotteries } = useMemo(() => {
        if (!lotteries) return { activeLotteries: [], pastLotteries: [] };
        const now = new Date();
        return lotteries.reduce(
          (acc, lottery) => {
            new Date(lottery.end_date) > now ? acc.activeLotteries.push(lottery) : acc.pastLotteries.push(lottery);
            return acc;
          },
          { activeLotteries: [] as typeof lotteries, pastLotteries: [] as typeof lotteries }
        );
      }, [lotteries]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      };

    return (
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-xl">
            <RulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Ticket className="text-teal-600" size={28}/>
                        Civic Lottery Hub
                    </h2>
                    <p className="mt-1 text-slate-500">
                        Your chance to win exciting rewards for being an active citizen.
                    </p>
                </div>
                <motion.button
                    onClick={() => setIsRulesModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <HelpCircle size={16} />
                    How it Works
                </motion.button>
            </div>
            
            {isLoading ? (
                <div className="text-center p-10">
                    <Trophy className="text-5xl text-slate-300 animate-pulse mx-auto" />
                    <p className="mt-4 text-slate-500">Loading Lotteries...</p>
                </div>
            ) : error ? (
                <div className="text-center p-6 bg-red-100 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-800">Could not load lotteries</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
            ) : (
                <>
                    <section className="mb-12">
                        <h3 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-teal-500/30 flex items-center gap-3"><Gift className="text-teal-600"/> Active Draws</h3>
                        {activeLotteries.length > 0 ? (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {activeLotteries.map(l => <LotteryCard key={l.id} lottery={l} />)}
                            </motion.div>
                        ) : (
                            <div className="text-center py-6 px-3 bg-slate-100 rounded-lg border">
                                <p className="text-slate-500">No active lotteries right now. Check back soon!</p>
                            </div>
                        )}
                    </section>
                     <section>
                        <h3 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b-2 border-slate-200 flex items-center gap-3"><History className="text-slate-500"/> Past Winners</h3>
                         {pastLotteries.length > 0 ? (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {pastLotteries.map(l => <LotteryCard key={l.id} lottery={l} />)}
                            </motion.div>
                        ) : (
                            <div className="text-center py-6 px-3 bg-slate-100 rounded-lg border">
                                <p className="text-slate-500">Winners from concluded lotteries will appear here.</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};