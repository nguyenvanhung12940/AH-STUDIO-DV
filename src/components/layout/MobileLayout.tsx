import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, BarChart3, MessageSquare, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils';

export const MobileLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: ClipboardList, label: 'Đánh giá', path: '/survey' },
    { icon: MessageSquare, label: 'Góp ý', path: '/feedback' },
  ];

  // Hide bottom nav in admin area
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:py-8">
      <div className="flex-grow bg-white flex flex-col max-w-[430px] mx-auto shadow-2xl relative overflow-hidden md:rounded-[3rem] md:border-[8px] md:border-slate-800 min-h-[100dvh] md:min-h-[850px] md:max-h-[900px]">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
            <img 
              src="/src/assets/images/vietnam_government_seal_1790167259016.jpg" 
              alt="Seal" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black tracking-tight text-[#0759A6] uppercase leading-none">UBND Xã Trà Liên</span>
            <h1 className="text-[10px] font-medium text-slate-500 uppercase leading-tight mt-0.5">Bộ phận Tiếp nhận và Trả kết quả</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto pb-24 flex flex-col">
          <div className="flex-grow">
            <Outlet />
          </div>
          {!isAdmin && (
            <footer className="py-12 px-6 text-center border-t border-slate-50 mt-12 bg-slate-50/30">
              <button 
                onClick={() => navigate('/admin/login')}
                className="text-[9px] font-bold text-slate-200 hover:text-slate-400 transition-colors uppercase tracking-[0.2em] py-2 px-4"
              >
                Đăng nhập quản trị
              </button>
            </footer>
          )}
        </main>

        {/* Bottom Navigation */}
        {!isAdmin && (
          <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-100 px-2 pb-safe">
            <div className="grid grid-cols-3 h-16">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex flex-col items-center justify-center transition-all active:scale-90 min-h-[44px] min-w-[44px]",
                      isActive ? "text-[#0759A6]" : "text-slate-400"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
      
      {/* Slogan Banner for Desktop */}
      <div className="hidden lg:flex fixed top-10 left-10 flex-col space-y-2 max-w-xs">
        <h2 className="text-3xl font-black text-[#0759A6] leading-tight">UBND XÃ TRÀ LIÊN</h2>
        <p className="text-slate-500 font-medium italic">“Lắng nghe hôm nay – Phục vụ tốt hơn ngày mai”</p>
      </div>
      
      <div className="hidden lg:flex fixed top-10 right-10 flex-col items-end space-y-2 max-w-xs text-right">
        <p className="text-2xl font-black text-[#0759A6] leading-tight">Lấy sự hài lòng của người dân làm thước đo</p>
        <div className="w-12 h-1 bg-red-500 rounded-full" />
      </div>
    </div>
  );
};
