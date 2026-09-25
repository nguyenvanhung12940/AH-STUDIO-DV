import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/utils';
import { SurveyResponse } from '../types/survey';
import { calculateStats } from '../utils/stats';
import { cn } from '../utils';
import { BarChart3, TrendingUp, Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export const Stats: React.FC = () => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const path = 'surveyResponses';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const responses = snapshot.docs.map(doc => doc.data() as SurveyResponse);
      setData(responses);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError('Dữ liệu này chỉ dành cho cán bộ quản trị.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const aggregated = useMemo(() => {
    if (data.length < 5) return null;
    return calculateStats(data);
  }, [data]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      <div className="w-8 h-8 border-4 border-[#0759A6] border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Đang tải dữ liệu...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-6 px-6 text-center">
      <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner">
        <Lock className="w-10 h-10 text-slate-300" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-black text-slate-900 uppercase">Quyền truy cập hạn chế</h3>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          {error}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">KẾT QUẢ KHẢO SÁT</h2>
        <p className="text-sm text-slate-500 font-medium">Cập nhật thời gian thực từ cộng đồng.</p>
      </div>

      {!aggregated ? (
        <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center space-y-6 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-10 h-10 text-slate-300" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-black text-slate-800 uppercase">Chưa đủ dữ liệu</p>
            <p className="text-[11px] text-slate-400 font-medium max-w-[200px] mx-auto">
              Cần tối thiểu 5 đánh giá để hiển thị thống kê tổng quan (Hiện có {data.length}).
            </p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 shadow-xl space-y-8">
            <div className="grid grid-cols-2 gap-8 divide-x divide-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lượt đánh giá</p>
                <p className="text-4xl font-black text-slate-900">{aggregated.total}</p>
                <div className="flex items-center space-x-1 text-green-500">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-[10px] font-bold">+100%</span>
                </div>
              </div>
              <div className="pl-8 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điểm trung bình</p>
                <p className="text-4xl font-black text-[#0759A6]">{aggregated.avgSatisfaction}<span className="text-lg text-slate-300">/5</span></p>
                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn("w-3 h-3", s <= Math.round(Number(aggregated.avgSatisfaction)) ? "fill-[#F6C343] text-[#F6C343]" : "text-slate-100")} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Kết quả theo tiêu chí</h3>
              <div className="space-y-5">
                {[
                  { label: 'Tìm hiểu thông tin', val: aggregated.criterionAverages.informationAccess },
                  { label: 'Hướng dẫn thủ tục', val: aggregated.criterionAverages.procedureGuidance },
                  { label: 'Thái độ phục vụ', val: aggregated.criterionAverages.staffAttitude },
                  { label: 'Thời gian giải quyết', val: aggregated.criterionAverages.processingTimeClarity },
                  { label: 'Dịch vụ trực tuyến', val: aggregated.criterionAverages.convenience },
                  { label: 'Đánh giá chung', val: aggregated.criterionAverages.overallSatisfaction },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tighter">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="text-[#0759A6]">{item.val}</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.val / 5) * 100}%` }}
                        className="h-full bg-[#0759A6]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0759A6] rounded-[2rem] p-6 text-white flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-widest opacity-80">Cam kết chất lượng</p>
              <p className="text-[13px] leading-relaxed font-medium">
                Kết quả khảo sát này là căn cứ để chúng tôi đánh giá mức độ hoàn thành nhiệm vụ và cải tiến quy trình phục vụ.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
