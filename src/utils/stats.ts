import { SurveyResponse } from '../types/survey';

export interface SurveyStats {
  total: number;
  avgSatisfaction: string;
  fiveStars: number;
  lowStars: number;
  serviceData: { name: string; value: number; avg: number }[];
  methodData: { name: string; value: number; avg: number }[];
  starData: { name: string; value: number }[];
  trendData: { date: string; avg: number }[];
  criterionAverages: {
    informationAccess: number;
    procedureGuidance: number;
    staffAttitude: number;
    convenience: number;
    processingTimeClarity: number;
    overallSatisfaction: number;
  };
  recentComments: SurveyResponse[];
}

export function calculateStats(data: SurveyResponse[]): SurveyStats | null {
  const total = data.length;
  if (total === 0) return null;

  const sumSatisfaction = data.reduce((acc, curr) => acc + curr.ratings.overallSatisfaction, 0);
  const avgSatisfaction = (sumSatisfaction / total).toFixed(2);
  const fiveStars = data.filter(d => d.ratings.overallSatisfaction === 5).length;
  const lowStars = data.filter(d => d.ratings.overallSatisfaction <= 2).length;

  // Group by service
  const serviceStats = data.reduce((acc: Record<string, { count: number; sum: number }>, curr) => {
    if (!acc[curr.serviceType]) acc[curr.serviceType] = { count: 0, sum: 0 };
    acc[curr.serviceType].count++;
    acc[curr.serviceType].sum += curr.ratings.overallSatisfaction;
    return acc;
  }, {});

  // Group by method
  const methodStats = data.reduce((acc: Record<string, { count: number; sum: number }>, curr) => {
    if (!acc[curr.submissionMethod]) acc[curr.submissionMethod] = { count: 0, sum: 0 };
    acc[curr.submissionMethod].count++;
    acc[curr.submissionMethod].sum += curr.ratings.overallSatisfaction;
    return acc;
  }, {});

  // Group by date for trend
  const trendStats = data.reduce((acc: Record<string, { count: number; sum: number }>, curr) => {
    const date = curr.createdAt?.toDate ? curr.createdAt.toDate().toLocaleDateString('vi-VN') : new Date(curr.createdAt).toLocaleDateString('vi-VN');
    if (!acc[date]) acc[date] = { count: 0, sum: 0 };
    acc[date].count++;
    acc[date].sum += curr.ratings.overallSatisfaction;
    return acc;
  }, {});

  const starDistribution = data.reduce((acc: Record<number, number>, curr) => {
    const score = curr.ratings.overallSatisfaction;
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const criterionAverages = {
    informationAccess: Number((data.reduce((acc, curr) => acc + curr.ratings.informationAccess, 0) / total).toFixed(2)),
    procedureGuidance: Number((data.reduce((acc, curr) => acc + curr.ratings.procedureGuidance, 0) / total).toFixed(2)),
    staffAttitude: Number((data.reduce((acc, curr) => acc + curr.ratings.staffAttitude, 0) / total).toFixed(2)),
    convenience: Number((data.reduce((acc, curr) => acc + curr.ratings.convenience, 0) / total).toFixed(2)),
    processingTimeClarity: Number((data.reduce((acc, curr) => acc + curr.ratings.processingTimeClarity, 0) / total).toFixed(2)),
    overallSatisfaction: Number((data.reduce((acc, curr) => acc + curr.ratings.overallSatisfaction, 0) / total).toFixed(2)),
  };

  return {
    total,
    avgSatisfaction,
    fiveStars,
    lowStars,
    serviceData: Object.entries(serviceStats).map(([name, stats]) => ({ 
      name, 
      value: stats.count,
      avg: Number((stats.sum / stats.count).toFixed(2))
    })),
    methodData: Object.entries(methodStats).map(([name, stats]) => ({ 
      name, 
      value: stats.count,
      avg: Number((stats.sum / stats.count).toFixed(2))
    })),
    starData: [1, 2, 3, 4, 5].map(star => ({
      name: `${star} sao`,
      value: starDistribution[star] || 0
    })),
    trendData: Object.entries(trendStats).map(([date, stats]) => ({
      date,
      avg: Number((stats.sum / stats.count).toFixed(2))
    })).sort((a, b) => {
      const [d1, m1, y1] = a.date.split('/').map(Number);
      const [d2, m2, y2] = b.date.split('/').map(Number);
      return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    }),
    criterionAverages,
    recentComments: data.filter(d => d.comment).slice(0, 10),
  };
}
