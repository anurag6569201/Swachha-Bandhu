// components/LotteryCard.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Clock, PartyPopper } from 'lucide-react';
import type { Lottery } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    if (countDown < 0) return;
    const interval = setInterval(() => setCountDown(countDownDate - new Date().getTime()), 1000);
    return () => clearInterval(interval);
  }, [countDownDate, countDown]);

  return {
    days: Math.floor(countDown / (1000 * 60 * 60 * 24)),
    hours: Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((countDown % (1000 * 60)) / 1000),
    isFinished: countDown < 0,
  };
};

const CountdownSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center w-16">
    <span className="text-3xl font-bold text-slate-800 tracking-tight">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-xs uppercase text-slate-500">{label}</span>
  </div>
);

export const LotteryCard: React.FC<{ lottery: Lottery }> = ({ lottery }) => {
  const { days, hours, minutes, seconds, isFinished } = useCountdown(lottery.end_date);
  
  const sponsorLogoUrl = lottery.sponsor?.logo ? (lottery.sponsor.logo.startsWith('http') ? lottery.sponsor.logo : `${API_BASE_URL}${lottery.sponsor.logo}`) : '';

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col bg-white border border-slate-200"
      whileHover={{ boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className={`p-6 flex-grow flex flex-col`}>
        {lottery.sponsor ? (
          <div className="flex items-center mb-4">
            <img src={sponsorLogoUrl} alt={lottery.sponsor.name} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-200 object-cover bg-slate-100" />
            <div>
              <p className="text-xs text-slate-500">Sponsored by</p>
              <a href={lottery.sponsor.website} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-teal-600 transition-colors">{lottery.sponsor.name}</a>
            </div>
          </div>
        ) : (
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full mr-4 bg-slate-100 flex items-center justify-center border">
                    <Building className="text-slate-500 text-2xl" />
                </div>
                 <div>
                    <p className="text-xs text-slate-500">Organized by</p>
                    <p className="font-bold text-slate-800">{lottery.municipality_name} Municipality</p>
                </div>
            </div>
        )}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{lottery.name}</h3>
        <p className="text-slate-600 text-sm mb-auto flex-grow">{lottery.description}</p>
        
        {!isFinished && (
          <div className="mt-6">
            <div className="flex justify-around items-center bg-slate-100 p-4 rounded-xl border border-slate-200">
              <CountdownSegment value={days} label="Days" />
              <CountdownSegment value={hours} label="Hours" />
              <CountdownSegment value={minutes} label="Mins" />
              <CountdownSegment value={seconds} label="Secs" />
            </div>
          </div>
        )}
      </div>

      {isFinished && (
        <motion.div 
            className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
          <motion.div initial={{ scale: 0.5, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}>
            <PartyPopper className="text-7xl text-amber-500 mb-4" />
          </motion.div>
          <h4 className="text-xl font-semibold text-slate-800">Lottery Concluded</h4>
          {lottery.winner_name ? (
            <>
                <p className="mb-1 text-sm text-slate-600">The lucky winner is</p>
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600">
                    {lottery.winner_name}
                </p>
            </>
          ) : (
             <p className="text-lg font-bold text-slate-700">Winner being drawn...</p>
          )}
        </motion.div>
      )}

      <div className={`border-t border-slate-200 px-6 py-3 text-xs text-slate-500 flex items-center justify-between ${isFinished ? 'opacity-40' : ''}`}>
        <div className="flex items-center gap-2">
            <Building size={14}/>
            <span>For {lottery.municipality_name}</span>
        </div>
        <div className="flex items-center gap-2">
            <Clock size={14}/>
            <span>Ends: {new Date(lottery.end_date).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};