import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ClipboardList, ShieldCheck } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-[#0759A6] text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="bg-white p-1.5 rounded-full">
            <ShieldCheck className="w-6 h-6 text-[#0759A6]" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base leading-tight uppercase">
              UBND XÃ TRÀ LIÊN
            </h1>
            <p className="text-[10px] md:text-xs opacity-90 uppercase tracking-wider">
              Bộ phận Tiếp nhận và Trả kết quả
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F3F8FD] flex flex-col font-sans text-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10 max-w-2xl">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-slate-500 text-sm">
        <p>© 2026 UBND Xã Trà Liên. Mọi thông tin phản hồi đều được bảo mật.</p>
      </footer>
    </div>
  );
};
