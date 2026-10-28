import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy } from 'lucide-react';

export interface ContestCountdownProps {
  endDate: string;
  isConcluded?: boolean;
  winnerName?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

function calculateTimeLeft(endDateStr: string): TimeLeft {
  const diff = new Date(endDateStr).getTime() - new Date().getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isEnded: false,
  };
}

export const ContestCountdown: React.FC<ContestCountdownProps> = ({
  endDate,
  isConcluded = false,
  winnerName,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (isConcluded || timeLeft.isEnded) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 bg-[#F6ECD4] dark:bg-[#33260E] border border-[#C79A3C]/40 rounded-full text-xs sm:text-sm font-semibold text-[#8C6819] dark:text-[#FCE6A2] shadow-sm ${className}`}
      >
        <Trophy className="w-4 h-4 text-[#C79A3C]" />
        <span>
          {winnerName ? `Contest Concluded • Winner: ${winnerName}` : 'Contest Concluded • Reviewing Entries'}
        </span>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'Hours', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Mins', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Secs', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-mono-label text-[#C9542F] font-semibold">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span>Submissions Close In:</span>
      </div>

      <div className="flex items-center gap-2">
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white dark:bg-[#1E1A15] border border-[#E8DFD1] dark:border-[#383026] rounded-xl flex items-center justify-center shadow-warm-sm overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={unit.value}
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-mono text-base sm:text-lg font-bold text-[#201A14] dark:text-[#F5EFE4]"
                  >
                    {unit.value}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[9px] font-mono-label text-[#A69E90] dark:text-[#6E665A] mt-1">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span className="text-[#C9542F] font-bold text-sm -mt-4">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
