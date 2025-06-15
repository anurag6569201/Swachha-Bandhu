import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTicketAlt, FaAward, FaCheckCircle } from 'react-icons/fa';

interface RulesModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const RuleItem: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div>
        <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center">
            {icon}
            {title}
        </h4>
        <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600 dark:text-slate-300">
            {children}
        </ul>
    </div>
);


export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: -50, scale: 0.9, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 50, scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative border border-slate-200 dark:border-slate-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full p-2"
                        aria-label="Close modal"
                    >
                        <FaTimes size={20} />
                    </button>
                    <div className="flex items-center text-purple-600 dark:text-purple-400 mb-6">
                        <FaTicketAlt size={32} className="mr-4" />
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Lottery Rules</h2>
                    </div>
                    <div className="space-y-6 text-sm leading-relaxed max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
                        <p className="text-slate-700 dark:text-slate-200">
                            Our Civic Lottery program is a token of our appreciation for your active role in creating better, cleaner communities. Here’s how you can participate and win.
                        </p>
                        
                        <RuleItem icon={<FaCheckCircle className="text-green-500 mr-3" />} title="How to Earn Tickets">
                            <li>Every valid new issue you report earns you an entry ticket.</li>
                            <li>Every peer verification you perform on another citizen's report also grants you a ticket.</li>
                            <li>The more you contribute, the higher your chances of winning!</li>
                        </RuleItem>
                        
                        <RuleItem icon={<FaAward className="text-yellow-500 mr-3" />} title="The Drawing Process">
                           <li>Winners are chosen randomly from all earned tickets at the end of each lottery period.</li>
                           <li>The winner is announced on this dashboard and notified via the app and email.</li>
                           <li>Prizes are often sponsored by our generous local partners for your municipality.</li>
                        </RuleItem>

                        <p className="text-xs text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
                            Terms and Conditions apply. The decision of the municipal authorities and Swachh Bandhu is final. Lotteries are subject to local regulations. Happy reporting!
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);