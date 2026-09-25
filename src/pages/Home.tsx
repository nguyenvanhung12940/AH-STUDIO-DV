import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl border border-blue-100 mb-4 overflow-hidden p-4">
           <ShieldCheck className="w-full h-full text-[#0759A6]" />
        </div>
        <h2 className="text-[#0759A6] text-lg font-bold tracking-tight uppercase px-4 leading-snug">
          UBND XÃ TRÀ LIÊN<br />
          <span className="text-slate-500 text-sm font-medium normal-case">Bộ phận Tiếp nhận và Trả kết quả</span>
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center space-y-6 max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-[#0759A6]"></div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            KHẢO SÁT MỨC ĐỘ<br />HÀI LÒNG CỦA NGƯỜI DÂN
          </h1>
          <div className="w-12 h-1 bg-[#F6C343] mx-auto rounded-full"></div>
        </div>

        <p className="text-slate-600 font-medium italic">
          “Lấy sự hài lòng của người dân làm thước đo”
        </p>

        <p className="text-slate-500 text-sm leading-relaxed px-4">
          Ý kiến của bạn là nguồn thông tin quan trọng để chúng tôi tiếp tục cải thiện chất lượng phục vụ.
        </p>

        <button
          onClick={() => navigate('/survey')}
          className="w-full bg-[#0759A6] hover:bg-[#0B78C8] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center space-x-3 group min-h-[44px]"
        >
          <ClipboardList className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span>BẮT ĐẦU KHẢO SÁT</span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-2 text-slate-400 text-sm"
      >
        <Heart className="w-4 h-4 text-red-400" />
        <span>Cảm ơn vì sự hợp tác của bạn!</span>
      </motion.div>
    </div>
  );
}
