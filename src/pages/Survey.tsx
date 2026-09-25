import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, CheckCircle, ShieldCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/utils';
import { StarRating } from '../components/StarRating';
import { useLocalStorage, clearLocalStorage } from '../hooks/useLocalStorage';
import { ServiceType, SubmissionMethod, ImprovementArea, Ratings } from '../types/survey';
import { cn, generateRandomId } from '../utils';

export const Survey: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const [step, setStep] = useLocalStorage('survey_step', 1);
  const [formData, setFormData] = useLocalStorage('survey_formData', {
    serviceType: '' as ServiceType | '',
    submissionMethod: '' as SubmissionMethod | '',
    ratings: {
      informationAccess: 0,
      procedureGuidance: 0,
      staffAttitude: 0,
      convenience: 0,
      processingTimeClarity: 0,
      overallSatisfaction: 0,
    } as Ratings,
    improvementArea: '' as ImprovementArea | '',
    comment: '',
  });

  // Check if we just restored data to show a friendly hint
  useEffect(() => {
    const hasProgress = localStorage.getItem('survey_formData');
    if (hasProgress && step > 1) {
      setShowRestorePrompt(true);
      const timer = setTimeout(() => setShowRestorePrompt(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isStep1Valid = formData.serviceType && formData.submissionMethod;
  const isStep2Valid = Object.values(formData.ratings).every(r => r > 0);
  const isStep3Valid = !!formData.improvementArea;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    const path = 'surveyResponses';
    try {
      const surveyId = generateRandomId();
      await addDoc(collection(db, path), {
        surveyId,
        createdAt: serverTimestamp(),
        serviceType: formData.serviceType,
        submissionMethod: formData.submissionMethod,
        ratings: formData.ratings,
        improvementArea: formData.improvementArea,
        comment: formData.comment || null,
        dataVersion: 1
      });
      clearLocalStorage('survey_formData');
      clearLocalStorage('survey_step');
      navigate('/success', { state: { surveyId } });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, path);
      setError('Đã có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      {/* Progress Stepper */}
      <div className="bg-white px-6 pt-4 pb-2 sticky top-0 z-20 shadow-sm border-b border-slate-50">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center space-y-1 relative z-10">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2",
                  step === s ? "bg-[#0759A6] border-[#0759A6] text-white scale-110 shadow-lg shadow-blue-100" : 
                  step > s ? "bg-green-500 border-green-500 text-white" : "bg-slate-50 border-slate-100 text-slate-300"
                )}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-tighter",
                step === s ? "text-[#0759A6]" : "text-slate-300"
              )}>
                {s === 1 ? 'Dịch vụ' : s === 2 ? 'Đánh giá' : s === 3 ? 'Góp ý' : 'Xác nhận'}
              </span>
            </div>
          ))}
          {/* Connector Line */}
          <div className="absolute top-8 left-10 right-10 h-0.5 bg-slate-100 -z-0" />
          <div 
            className="absolute top-8 left-10 h-0.5 bg-[#0759A6] transition-all duration-500 -z-0" 
            style={{ width: `calc(${(step - 1) / 3} * (100% - 5rem))` }}
          />
        </div>
      </div>

      <div className="flex-grow p-6">
        {/* Restore Prompt */}
        <AnimatePresence>
          {showRestorePrompt && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[380px] px-4"
            >
              <div className="bg-slate-900 text-white shadow-2xl rounded-2xl p-4 flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <Info className="w-5 h-5 text-blue-300" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-black uppercase tracking-widest">Tiếp tục khảo sát?</p>
                  <p className="text-[11px] text-slate-400">Dữ liệu cũ đã được khôi phục.</p>
                </div>
                <button 
                  onClick={() => setShowRestorePrompt(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 leading-tight">1. Thông tin dịch vụ</h3>
                    <span className="text-[9px] font-black bg-blue-50 text-[#0759A6] px-2 py-1 rounded-lg uppercase tracking-tighter">~1 phút hoàn thành</span>
                  </div>
                  <p className="text-sm text-slate-500">Chọn lĩnh vực và hình thức bạn đã thực hiện.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lĩnh vực hồ sơ</p>
                    <div className="grid grid-cols-2 gap-3">
                      {["Hộ tịch", "Chứng thực", "Đất đai", "Xây dựng", "Chính sách xã hội", "Khác"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, serviceType: type as ServiceType})}
                          className={cn(
                            "py-5 px-4 rounded-3xl text-center transition-all border-2 flex flex-col items-center justify-center space-y-2",
                            formData.serviceType === type 
                              ? "bg-blue-50 border-[#0759A6] text-[#0759A6] shadow-lg shadow-blue-50" 
                              : "bg-white border-slate-50 text-slate-500 hover:border-slate-200"
                          )}
                        >
                          <span className="font-black text-xs uppercase tracking-tight">{type}</span>
                          {formData.serviceType === type && <CheckCircle className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cách thức thực hiện</p>
                    <div className="flex bg-slate-50 p-1.5 rounded-3xl border-2 border-slate-100">
                      {['Trực tiếp', 'Trực tuyến', 'Kết hợp'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setFormData({...formData, submissionMethod: method as SubmissionMethod})}
                          className={cn(
                            "flex-1 py-3 px-2 rounded-[1.25rem] text-center transition-all text-[10px] font-black uppercase tracking-tighter",
                            formData.submissionMethod === method 
                              ? "bg-white text-[#0759A6] shadow-sm" 
                              : "text-slate-400"
                          )}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pb-6 z-10">
                  <button
                    disabled={!isStep1Valid}
                    onClick={nextStep}
                    className="w-full bg-[#0759A6] disabled:bg-slate-200 disabled:text-slate-400 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all shadow-2xl shadow-blue-100 h-20 active:scale-95 min-h-[44px]"
                  >
                    <span>Tiếp tục đánh giá</span>
                    <ArrowRight className="w-5 h-5 bg-white/20 rounded-full p-1" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">2. Đánh giá trải nghiệm</h3>
                  <p className="text-sm text-slate-500">Vui lòng đánh giá mức độ hài lòng theo các tiêu chí sau.</p>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border-2 border-slate-50 shadow-sm space-y-2">
                  <StarRating 
                    label="1. Dễ dàng tìm hiểu thông tin về thủ tục"
                    value={formData.ratings.informationAccess}
                    onChange={(v) => setFormData({...formData, ratings: {...formData.ratings, informationAccess: v}})}
                  />
                  <StarRating 
                    label="2. Hướng dẫn thủ tục rõ ràng"
                    value={formData.ratings.procedureGuidance}
                    onChange={(v) => setFormData({...formData, ratings: {...formData.ratings, procedureGuidance: v}})}
                  />
                  <StarRating 
                    label="3. Thái độ giao tiếp và phục vụ của cán bộ"
                    value={formData.ratings.staffAttitude}
                    onChange={(v) => setFormData({...formData, ratings: {...formData.ratings, staffAttitude: v}})}
                  />
                  <StarRating 
                    label="4. Sự thuận tiện trong quá trình thực hiện"
                    value={formData.ratings.convenience}
                    onChange={(v) => setFormData({...formData, ratings: {...formData.ratings, convenience: v}})}
                  />
                  <StarRating 
                    label="5. Thông tin về thời gian giải quyết"
                    value={formData.ratings.processingTimeClarity}
                    onChange={(v) => setFormData({...formData, ratings: {...formData.ratings, processingTimeClarity: v}})}
                  />
                  <StarRating 
                    label="6. Mức độ hài lòng chung"
                    value={formData.ratings.overallSatisfaction}
                    onChange={(v) => setFormData({...formData, ratings: {...formData.ratings, overallSatisfaction: v}})}
                  />
                </div>

                <div className="flex space-x-3 pb-8">
                  <button onClick={prevStep} className="flex-1 bg-slate-50 text-slate-500 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs min-h-[44px]">Quay lại</button>
                  <button
                    disabled={!isStep2Valid}
                    onClick={nextStep}
                    className="flex-[2] bg-[#0759A6] disabled:bg-slate-200 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 shadow-xl shadow-blue-100 min-h-[44px]"
                  >
                    <span>Tiếp theo</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">3. Góp ý – Đề xuất</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-slate-500">Giúp chúng tôi phục vụ tốt hơn.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Nội dung cần cải thiện?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["Thời gian giải quyết", "Hướng dẫn thủ tục", "Thái độ phục vụ", "Cơ sở vật chất", "Dịch vụ trực tuyến", "Khác"].map((area) => (
                        <button
                          key={area}
                          onClick={() => setFormData({...formData, improvementArea: area as ImprovementArea})}
                          className={cn(
                            "py-3 px-4 rounded-2xl text-left transition-all border-2 flex flex-col justify-between h-20",
                            formData.improvementArea === area 
                              ? "bg-blue-50 border-[#0759A6] text-[#0759A6]" 
                              : "bg-white border-slate-50 text-slate-500"
                          )}
                        >
                          <span className="font-bold text-[11px] leading-tight uppercase">{area}</span>
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center self-end transition-all",
                            formData.improvementArea === area ? "border-[#0759A6] bg-[#0759A6]" : "border-slate-200"
                          )}>
                            {formData.improvementArea === area && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Ý kiến khác của bạn</p>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value.substring(0, 1000)})}
                      placeholder="Nhập nội dung (nếu có)..."
                      className="w-full rounded-[2rem] border-2 border-slate-100 focus:border-[#0759A6] focus:ring-4 focus:ring-blue-50 py-5 px-6 bg-slate-50 min-h-[140px] text-sm font-medium"
                    />
                  </div>

                  <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] flex items-start space-x-3 border border-red-100">
                    <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed font-black uppercase italic tracking-tight">
                      Cảnh báo: Tuyệt đối không nhập thông tin cá nhân (Số CCCD, Số điện thoại, Địa chỉ) vào ô góp ý này.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pb-8">
                  <button onClick={prevStep} className="flex-1 bg-slate-50 text-slate-500 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs min-h-[44px]">Quay lại</button>
                  <button
                    disabled={!isStep3Valid}
                    onClick={nextStep}
                    className="flex-[2] bg-[#0759A6] disabled:bg-slate-200 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 shadow-xl shadow-blue-100 min-h-[44px]"
                  >
                    <span>Tiếp theo</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">4. Xác nhận thông tin</h3>
                  <p className="text-sm text-slate-500">Vui lòng kiểm tra lại trước khi gửi.</p>
                </div>
                
                <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl space-y-8">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-[#0759A6]">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h4 className="font-black text-lg text-slate-900 uppercase">Sẵn sàng gửi</h4>
                    </div>

                    <div className="space-y-4 divide-y divide-slate-50">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[11px] font-black text-slate-400 uppercase">Dịch vụ</span>
                        <span className="text-sm font-black text-slate-800">{formData.serviceType}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[11px] font-black text-slate-400 uppercase">Hình thức</span>
                        <span className="text-sm font-black text-slate-800">{formData.submissionMethod}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[11px] font-black text-slate-400 uppercase">Hài lòng chung</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-[#F6C343] fill-current" />
                          <span className="text-sm font-black text-slate-800">{formData.ratings.overallSatisfaction}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={cn(
                      "w-full text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all shadow-2xl h-16 min-h-[44px]",
                      isSubmitting ? "bg-slate-400" : "bg-[#0759A6] hover:bg-[#064a8a] shadow-blue-200"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Gửi đánh giá</span>
                        <ArrowRight className="w-5 h-5 bg-white/20 rounded-full p-1" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-center">
                  <button onClick={prevStep} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors min-h-[44px] min-w-[44px]">Sửa lại thông tin</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
