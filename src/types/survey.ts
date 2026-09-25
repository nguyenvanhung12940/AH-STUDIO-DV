export type ServiceType = 'Hộ tịch' | 'Chứng thực' | 'Đất đai' | 'Xây dựng' | 'Chính sách xã hội' | 'Khác';
export type SubmissionMethod = 'Trực tiếp' | 'Trực tuyến' | 'Kết hợp';
export type ImprovementArea = 'Thời gian giải quyết' | 'Hướng dẫn thủ tục' | 'Thái độ phục vụ' | 'Cơ sở vật chất' | 'Dịch vụ trực tuyến' | 'Khác';

export interface Ratings {
  informationAccess: number;
  procedureGuidance: number;
  staffAttitude: number;
  convenience: number;
  processingTimeClarity: number;
  overallSatisfaction: number;
}

export interface SurveyResponse {
  surveyId: string;
  createdAt: any;
  serviceType: ServiceType;
  submissionMethod: SubmissionMethod;
  ratings: Ratings;
  improvementArea: ImprovementArea;
  comment: string | null;
  dataVersion: number;
}
