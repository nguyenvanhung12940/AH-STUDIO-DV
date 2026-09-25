import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Share2, ClipboardList } from 'lucide-react';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { surveyId } = location.state || { surveyId: 'N/A' };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 h-full">
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10 }}
        className="bg-green-50 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner"
      >
        <div className="bg-white w-20 h-20 rounded-3xl shadow-xl flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-8"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Cảm ơn bạn!</h2>
          <p className="text-slate-500 font-medium px-4 leading-relaxed">
            Ý kiến của bạn đã được gửi thành công. Chúng tôi sẽ tổng hợp và cải thiện chất lượng phục vụ.
          </p>
        </div>
        
        <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 inline-block w-full">
          <div className="flex items-center justify-center space-x-3 text-[#0759A6] mb-3">
            <Share2 className="w-5 h-5" />
            <p className="text-[11px] font-black uppercase tracking-widest">Mã xác nhận khảo sát</p>
          </div>
          <p className="text-lg font-mono font-black text-slate-800 tracking-widest">{surveyId}</p>
        </div>

        <div className="space-y-4 w-full pt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#0759A6] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-2 shadow-2xl shadow-blue-200 active:scale-95 h-16"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
          
          <button
            onClick={() => navigate('/survey')}
            className="w-full bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[2rem] font-bold uppercase tracking-widest text-xs transition-all active:scale-95 h-16"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            <span>Thực hiện đánh giá khác</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
