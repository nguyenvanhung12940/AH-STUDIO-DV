import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { SurveyResponse } from '../types/survey';
import { cn, formatDate } from '../utils';
import { calculateStats } from '../utils/stats';
import { 
  Users, Star, TrendingUp, AlertCircle, Calendar, 
  Filter, Download, LogOut, QrCode as QrIcon, BarChart3,
  Search, ChevronLeft, ChevronRight, MessageSquare, Database
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0759A6', '#F6C343', '#10B981', '#F43F5E', '#8B5CF6', '#F97316'];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Filters
  const [serviceFilter, setServiceFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'surveyResponses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const responses = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as SurveyResponse & { id: string }));
      setData(responses);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Bạn không có quyền truy cập dữ liệu này hoặc phiên đăng nhập đã hết hạn.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(d => {
      const matchesService = !serviceFilter || d.serviceType === serviceFilter;
      const matchesMethod = !methodFilter || d.submissionMethod === methodFilter;
      
      let matchesDate = true;
      if (startDate || endDate) {
        const docDate = d.createdAt?.toDate ? d.createdAt.toDate() : new Date(d.createdAt);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (docDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (docDate > end) matchesDate = false;
        }
      }
      
      return matchesService && matchesMethod && matchesDate;
    });
  }, [data, serviceFilter, methodFilter, startDate, endDate]);

  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[#0759A6] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-slate-500 animate-pulse">ĐANG TẢI DỮ LIỆU HỆ THỐNG...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-6 text-center">
      <div className="bg-red-50 p-6 rounded-[2.5rem]">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Truy cập bị từ chối</h2>
        <p className="text-slate-500 max-w-xs mx-auto">{error}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => window.location.reload()} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all min-h-[44px]">Thử lại</button>
        <button onClick={() => navigate('/admin/login')} className="bg-[#0759A6] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all min-h-[44px]">Đăng nhập lại</button>
      </div>
    </div>
  );

  if (data.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-6 text-center bg-slate-50">
       <div className="bg-white p-12 rounded-[3rem] shadow-xl border-2 border-dashed border-slate-200 max-w-md">
          <Database className="w-20 h-20 text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Chưa có dữ liệu</h2>
          <p className="text-slate-500 mb-8 font-medium">Hệ thống chưa ghi nhận bất kỳ lượt khảo sát nào từ người dân. Hãy chia sẻ mã QR để bắt đầu.</p>
          <button onClick={() => setShowQR(true)} className="w-full bg-[#0759A6] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 min-h-[44px]">
            <QrIcon className="w-5 h-5" />
            <span>LẤY MÃ QR KHẢO SÁT</span>
          </button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-[#0759A6] p-2.5 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 uppercase tracking-tight leading-none">BẢNG QUẢN TRỊ</h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">UBND XÃ TRÀ LIÊN</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => setShowQR(true)} 
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-100 min-h-[44px]"
          >
            <QrIcon className="w-5 h-5" />
            <span className="text-xs font-bold hidden md:inline">MÃ QR</span>
          </button>
          <div className="h-8 w-px bg-slate-100" />
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-50 min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-bold hidden md:inline">ĐĂNG XUẤT</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KpiCard icon={Users} label="Tổng khảo sát" value={stats?.total || 0} color="blue" />
          <KpiCard icon={Star} label="Hài lòng TB" value={stats?.avgSatisfaction || '0.0'} color="yellow" suffix="/5" />
          <KpiCard icon={TrendingUp} label="Đánh giá 5 sao" value={stats?.fiveStars || 0} color="green" />
          <KpiCard icon={AlertCircle} label="Đánh giá kém (1-2★)" value={stats?.lowStars || 0} color="red" />
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 text-sm font-black text-slate-800 mb-6 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-[#0759A6]" />
            <span>Bộ lọc dữ liệu chuyên sâu</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Lĩnh vực dịch vụ</label>
              <select 
                value={serviceFilter} 
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full text-sm font-bold border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
              >
                <option value="">Tất cả lĩnh vực</option>
                <option value="Hộ tịch">Hộ tịch</option>
                <option value="Chứng thực">Chứng thực</option>
                <option value="Đất đai">Đất đai</option>
                <option value="Xây dựng">Xây dựng</option>
                <option value="Chính sách xã hội">Chính sách xã hội</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Hình thức thực hiện</label>
              <select 
                value={methodFilter} 
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full text-sm font-bold border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
              >
                <option value="">Tất cả hình thức</option>
                <option value="Trực tiếp">Trực tiếp</option>
                <option value="Trực tuyến">Trực tuyến</option>
                <option value="Kết hợp">Kết hợp</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Từ ngày</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm font-bold border-2 border-slate-100 bg-slate-50 rounded-xl pl-12 pr-4 py-3 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase">Đến ngày</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm font-bold border-2 border-slate-100 bg-slate-50 rounded-xl pl-12 pr-4 py-3 outline-none"
                />
              </div>
            </div>
          </div>
          {(serviceFilter || methodFilter || startDate || endDate) && (
            <button 
              onClick={() => {
                setServiceFilter('');
                setMethodFilter('');
                setStartDate('');
                setEndDate('');
              }}
              className="mt-6 text-xs font-bold text-red-500 hover:underline min-h-[44px] min-w-[44px]"
            >
              XÓA TẤT CẢ BỘ LỌC
            </button>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Xu hướng hài lòng theo thời gian</h3>
              <div className="flex items-center space-x-1 text-green-500 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>CHỈ SỐ THỰC TẾ</span>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.trendData}>
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0759A6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0759A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} dy={10} />
                  <YAxis domain={[0, 5]} fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="avg" stroke="#0759A6" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Star Distribution */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-8">Phân bố mức độ hài lòng (1-5★)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.starData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{fontWeight: 'bold'}} dy={10} />
                  <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Bar dataKey="value" fill="#0759A6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Criteria Score Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-8">Điểm trung bình theo tiêu chí</h3>
            <div className="space-y-6">
              {stats && Object.entries(stats.criterionAverages).map(([key, value]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
                    <span className="text-slate-500">
                      {key === 'informationAccess' ? 'Dễ tìm hiểu thông tin' : 
                       key === 'procedureGuidance' ? 'Hướng dẫn rõ ràng' :
                       key === 'staffAttitude' ? 'Thái độ cán bộ' :
                       key === 'convenience' ? 'Quy trình thuận tiện' : 'Thời gian giải quyết'}
                    </span>
                    <span className="text-[#0759A6] font-black">{value}</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0759A6] rounded-full transition-all duration-1000" 
                      style={{ width: `${(value / 5) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scores by Service Group */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-8">Điểm TB theo nhóm dịch vụ</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={stats?.serviceData} margin={{left: 20}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 5]} fontSize={10} axisLine={false} tickLine={false} hide />
                  <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} tick={{fontWeight: 'bold', fill: '#64748b'}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Bar dataKey="avg" fill="#F6C343" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 10, fontWeight: 'black', fill: '#0759A6' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scores by Method */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-900 uppercase tracking-tight mb-8">Điểm TB theo hình thức thực hiện</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.methodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="avg"
                    nameKey="name"
                  >
                    {stats?.methodData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-[#0759A6]" />
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Danh sách chi tiết phản hồi</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black bg-blue-100 text-[#0759A6] px-4 py-1.5 rounded-full uppercase tracking-widest">
                Hiển thị {filteredData.length} kết quả
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày thực hiện</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lĩnh vực</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hình thức</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hài lòng</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cần cải thiện</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Góp ý khách hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center space-y-3 opacity-30">
                        <Search className="w-10 h-10" />
                        <p className="text-sm font-bold">KHÔNG TÌM THẤY KẾT QUẢ PHÙ HỢP VỚI BỘ LỌC</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{formatDate(d.createdAt).split(' ')[0]}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{formatDate(d.createdAt).split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-black text-[#0759A6] bg-blue-50 px-3 py-1 rounded-lg">
                          {d.serviceType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600">{d.submissionMethod}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className={cn("w-3.5 h-3.5", d.ratings.overallSatisfaction >= 4 ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200")} />
                          <span className="text-sm font-black text-slate-900">{d.ratings.overallSatisfaction}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "text-[10px] font-black uppercase px-2.5 py-1 rounded-full",
                          d.improvementArea === 'Khác' ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-500"
                        )}>
                          {d.improvementArea || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <p className="text-xs text-slate-600 font-medium line-clamp-2 italic">
                          {d.comment ? `"${d.comment}"` : '—'}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowQR(false)} />
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full relative z-10 text-center space-y-8 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hệ thống khảo sát</h3>
              <p className="text-xs font-medium text-slate-500">Quét mã dưới đây để người dân thực hiện đánh giá tại quầy.</p>
            </div>
            <div className="bg-white p-6 border-[8px] border-[#0759A6] rounded-[2.5rem] inline-block shadow-xl">
              <QRCodeSVG 
                value={window.location.origin} 
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl flex items-center space-x-3 text-left">
               <div className="bg-[#0759A6] p-2 rounded-lg">
                 <QrIcon className="w-5 h-5 text-white" />
               </div>
               <p className="text-[10px] font-bold text-[#0759A6] uppercase leading-relaxed">Dán mã này tại vị trí tiếp nhận hồ sơ để thuận tiện cho người dân.</p>
            </div>
            <button 
              onClick={() => setShowQR(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all min-h-[44px]"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value, color, suffix = '' }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-600 text-white shadow-blue-100',
    yellow: 'bg-yellow-400 text-white shadow-yellow-100',
    green: 'bg-green-500 text-white shadow-green-100',
    red: 'bg-red-500 text-white shadow-red-100',
  };

  const lightColorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", lightColorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn("w-2 h-2 rounded-full", colorMap[color].split(' ')[0])} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline space-x-1">
          <p className="text-3xl font-black text-slate-900">{value}</p>
          {suffix && <span className="text-sm font-bold text-slate-300">{suffix}</span>}
        </div>
      </div>
    </div>
  );
};
