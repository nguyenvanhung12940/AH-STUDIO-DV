import React from 'react';
import { Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, label }) => {
  const descriptions = [
    'Rất không hài lòng',
    'Không hài lòng',
    'Bình thường',
    'Hài lòng',
    'Rất hài lòng'
  ];

  return (
    <div className="space-y-4 py-6 border-b border-slate-50 last:border-0">
      <div className="flex items-start justify-between">
        <p className="text-slate-800 font-black text-[15px] leading-tight flex-grow max-w-[80%]">{label}</p>
        <div className="flex flex-col items-end shrink-0">
           {value > 0 ? (
             <span className={cn(
               "text-[10px] font-black px-2 py-0.5 rounded-full text-white transition-colors duration-300",
               value <= 2 ? "bg-red-500" : value === 3 ? "bg-amber-500" : "bg-[#0759A6]"
             )}>
              {value}/5
            </span>
           ) : (
             <span className="text-[9px] font-bold text-slate-300 uppercase animate-pulse">Chọn sao</span>
           )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none transition-all active:scale-150 p-2 relative min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Star
                className={cn(
                  "w-11 h-11 transition-all duration-300",
                  star <= value 
                    ? cn(
                        "drop-shadow-md",
                        value <= 2 ? "fill-red-400 text-red-500" : 
                        value === 3 ? "fill-amber-400 text-amber-500" : 
                        "fill-[#F6C343] text-[#F6C343]"
                      )
                    : "text-slate-100 fill-slate-50"
                )}
              />
              {star === value && (
                <motion.div 
                  layoutId="activeStarCircle"
                  className="absolute inset-0 border-2 border-[#0759A6] rounded-full scale-125 -z-10" 
                />
              )}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between px-2">
          <span className="text-[9px] font-black text-red-400 uppercase tracking-tighter">Rất kém</span>
          <span className="text-[9px] font-black text-[#0759A6] uppercase tracking-tighter">Rất tốt</span>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {value > 0 && (
          <motion.p 
            key={value}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={cn(
              "text-[13px] font-black text-center pt-1",
              value <= 2 ? "text-red-500" : value === 3 ? "text-amber-600" : "text-[#0759A6]"
            )}
          >
            {descriptions[value - 1]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
