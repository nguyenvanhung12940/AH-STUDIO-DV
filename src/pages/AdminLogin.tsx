import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to ensure they use the correct staff email
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Đăng nhập thất bại. Vui lòng sử dụng tài khoản Gmail đã đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 w-full max-w-md text-center space-y-8"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-10 h-10 text-[#0759A6]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase leading-tight">Hệ thống Quản trị</h2>
            <p className="text-sm font-bold text-slate-400 mt-2">Dành cho Cán bộ UBND Xã Trà Liên</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className="w-full bg-[#0759A6] hover:bg-[#064a8a] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-2xl shadow-blue-200 flex flex-col items-center justify-center space-y-2 active:scale-95 disabled:opacity-50 min-h-[120px]"
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-lg">KÍCH VÀO ĐÂY</span>
                <span className="text-[10px] opacity-80 font-medium">ĐỂ VÀO XEM KẾT QUẢ ĐÁNH GIÁ</span>
                <ArrowRight className="w-5 h-5 mt-2 animate-bounce" />
              </>
            )}
          </button>
          
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Hệ thống sẽ sử dụng Gmail để xác thực quyền truy cập
          </p>
        </div>

        <div className="pt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.2em] px-6 py-2"
          >
            Quay lại trang chủ
          </button>
        </div>
      </motion.div>
    </div>
  );
};
