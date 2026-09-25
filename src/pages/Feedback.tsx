import React from 'react';
import { MessageSquare, Phone, Globe, MapPin, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Feedback: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 p-6 pb-20">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">THÔNG TIN PHẢN HỒI</h2>
        <p className="text-sm text-slate-500 font-medium">Ngoài khảo sát trực tuyến, bạn có thể đóng góp qua các kênh sau.</p>
      </div>

      <div className="space-y-4">
        <ContactCard 
          icon={Phone} 
          title="Đường dây nóng" 
          value="0235.xxx.xxxx" 
          desc="Tiếp nhận phản ánh 24/7"
        />
        <ContactCard 
          icon={MessageSquare} 
          title="Hòm thư góp ý" 
          value="traliendichvucong@gmail.com" 
          desc="Phản hồi trong vòng 3 ngày làm việc"
        />
        <ContactCard 
          icon={Globe} 
          title="Cổng thông tin" 
          value="tralien.quangnam.gov.vn" 
          desc="Tra cứu kết quả giải quyết TTHC"
        />
        <ContactCard 
          icon={MapPin} 
          title="Địa chỉ trụ sở" 
          value="Thôn Định Yên - Xã Trà Liên" 
          desc="Thành Phố Đà Nẵng"
        />
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl">
        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-6">Quy trình xử lý</h3>
        <div className="space-y-6">
          {[
            { step: '01', title: 'Tiếp nhận', desc: 'Mọi ý kiến được ghi nhận tự động vào hệ thống bảo mật.' },
            { step: '02', title: 'Phân loại', desc: 'Cán bộ chuyên trách xem xét và chuyển đến bộ phận liên quan.' },
            { step: '03', title: 'Xử lý', desc: 'Khắc phục các hạn chế và cải thiện chất lượng phục vụ ngay lập tức.' }
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-5 relative group">
              {i < 2 && <div className="absolute left-4 top-8 w-0.5 h-10 bg-slate-50" />}
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0759A6] font-black text-xs flex items-center justify-center shrink-0 border-2 border-white shadow-sm">{item.step}</span>
              <div className="space-y-1">
                <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{item.title}</p>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon: Icon, title, value, desc }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 flex items-center space-x-5 transition-all hover:shadow-lg active:scale-95 group">
    <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
      <Icon className="w-6 h-6 text-[#0759A6]" />
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-sm font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{desc}</p>
    </div>
  </div>
);
