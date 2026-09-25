import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-12 space-y-8 bg-gradient-to-b from-blue-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white mb-4">
            <img 
              src="/src/assets/images/vietnam_government_seal_1790167259016.jpg" 
              alt="Seal" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[12px] font-bold text-slate-500 tracking-[0.2em] uppercase">UBND Xã Trà Liên</p>
          <h2 className="text-2xl font-black text-slate-900 leading-tight px-4 uppercase">
            Khảo sát mức độ hài lòng của người dân
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Ý kiến của bạn là động lực để chúng tôi phục vụ tốt hơn!
          </p>
        </div>

        <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] relative group border-4 border-white">
          <img 
            src="/src/assets/images/ubnd_building_modern_1790154174826.jpg" 
            alt="UBND Xã Trà Liên"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <p className="text-white text-xs font-bold uppercase tracking-widest opacity-90">Khu vực Trà Liên</p>
              </div>
              <p className="text-white text-lg font-black leading-tight italic">“Lắng nghe hôm nay – Phục vụ tốt hơn ngày mai”</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/survey')}
            className="w-full bg-[#0759A6] hover:bg-[#064a8a] text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-200 active:scale-95 h-14 min-h-[44px]"
          >
            <ArrowRight className="w-5 h-5 bg-white/20 rounded-full p-1" />
            <span className="uppercase tracking-widest">Bắt đầu khảo sát</span>
          </button>
          
          <button
            onClick={() => navigate('/feedback')}
            className="w-full bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center active:scale-95 h-14 min-h-[44px]"
          >
            <span>Tìm hiểu thêm</span>
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo mật ẩn danh hoàn toàn</span>
        </div>
      </motion.div>
    </div>
  );
};
