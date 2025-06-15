import React from 'react';
import type { UserBadge } from '../types';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

interface BadgeListProps {
  badges: UserBadge[];
  isLoading: boolean;
}

export const BadgeList: React.FC<BadgeListProps> = ({ badges, isLoading }) => {
  if (isLoading) {
    return (
        <div className="flex space-x-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 w-20 bg-slate-200 rounded-full animate-pulse"></div>
            ))}
        </div>
    )
  }
  
  if (badges.length === 0) {
    return <div className="text-center py-5 px-3 bg-slate-100 rounded-lg border">
        <p className="text-sm text-slate-500">Keep participating to earn your first badge!</p>
    </div>;
  }

  const badgeIconUrl = (iconPath: string) => {
    return iconPath.startsWith('http') ? iconPath : `${API_BASE_URL}${iconPath}`;
  }

  return (
    <div className="flex flex-wrap gap-5">
      {badges.map(({ badge }, index) => (
        <motion.div
          key={badge.name}
          className="relative group"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1, z: 10 }}
        >
          <img
            src={badgeIconUrl(badge.icon)}
            alt={badge.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-200 bg-slate-100 transition-all duration-300 group-hover:border-amber-400 shadow-lg group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]"
          />
          <div className="absolute bottom-full mb-3 w-56 left-1/2 -translate-x-1/2 p-3 bg-slate-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <h4 className="font-bold text-base text-amber-400">{badge.name}</h4>
            <p className="text-slate-300">{badge.description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};