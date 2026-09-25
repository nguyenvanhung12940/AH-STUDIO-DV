import { describe, it, expect } from 'vitest';
import { calculateStats } from './stats';
import { SurveyResponse } from '../types/survey';

describe('calculateStats', () => {
  it('should return null for empty data', () => {
    expect(calculateStats([])).toBeNull();
  });

  it('should calculate stats correctly for a single response', () => {
    const mockData: SurveyResponse[] = [
      {
        surveyId: '1',
        createdAt: new Date(),
        serviceType: 'Hộ tịch',
        submissionMethod: 'Trực tiếp',
        ratings: {
          informationAccess: 5,
          procedureGuidance: 5,
          staffAttitude: 5,
          convenience: 5,
          processingTimeClarity: 5,
          overallSatisfaction: 5,
        },
        improvementArea: 'Khác',
        comment: 'Tuyệt vời',
        dataVersion: 1,
      },
    ];

    const stats = calculateStats(mockData);
    expect(stats).not.toBeNull();
    if (stats) {
      expect(stats.total).toBe(1);
      expect(stats.avgSatisfaction).toBe('5.00');
      expect(stats.fiveStars).toBe(1);
      expect(stats.lowStars).toBe(0);
      expect(stats.serviceData).toContainEqual({ name: 'Hộ tịch', value: 1 });
      expect(stats.methodData).toContainEqual({ name: 'Trực tiếp', value: 1 });
      expect(stats.starData.find(s => s.name === '5 sao')?.value).toBe(1);
      expect(stats.criterionAverages.informationAccess).toBe(5);
    }
  });

  it('should calculate averages and distributions correctly for multiple responses', () => {
    const mockData: SurveyResponse[] = [
      {
        surveyId: '1',
        createdAt: new Date(),
        serviceType: 'Hộ tịch',
        submissionMethod: 'Trực tiếp',
        ratings: {
          informationAccess: 5,
          procedureGuidance: 4,
          staffAttitude: 5,
          convenience: 4,
          processingTimeClarity: 5,
          overallSatisfaction: 5,
        },
        improvementArea: 'Khác',
        comment: 'Tốt',
        dataVersion: 1,
      },
      {
        surveyId: '2',
        createdAt: new Date(),
        serviceType: 'Đất đai',
        submissionMethod: 'Trực tuyến',
        ratings: {
          informationAccess: 1,
          procedureGuidance: 1,
          staffAttitude: 2,
          convenience: 2,
          processingTimeClarity: 1,
          overallSatisfaction: 1,
        },
        improvementArea: 'Thời gian giải quyết',
        comment: 'Chậm',
        dataVersion: 1,
      },
    ];

    const stats = calculateStats(mockData);
    expect(stats).not.toBeNull();
    if (stats) {
      expect(stats.total).toBe(2);
      // (5 + 1) / 2 = 3.00
      expect(stats.avgSatisfaction).toBe('3.00');
      expect(stats.fiveStars).toBe(1);
      expect(stats.lowStars).toBe(1);
      
      // Criterion averages
      // informationAccess: (5 + 1) / 2 = 3
      expect(stats.criterionAverages.informationAccess).toBe(3);
      // procedureGuidance: (4 + 1) / 2 = 2.5
      expect(stats.criterionAverages.procedureGuidance).toBe(2.5);
      
      expect(stats.serviceData).toContainEqual({ name: 'Hộ tịch', value: 1 });
      expect(stats.serviceData).toContainEqual({ name: 'Đất đai', value: 1 });
      
      expect(stats.starData.find(s => s.name === '5 sao')?.value).toBe(1);
      expect(stats.starData.find(s => s.name === '1 sao')?.value).toBe(1);
      expect(stats.starData.find(s => s.name === '3 sao')?.value).toBe(0);
    }
  });

  it('should handle rounding and avoid precision issues', () => {
    const mockData: SurveyResponse[] = [
      { ratings: { informationAccess: 4, procedureGuidance: 4, staffAttitude: 4, convenience: 4, processingTimeClarity: 4, overallSatisfaction: 4 } } as any,
      { ratings: { informationAccess: 5, procedureGuidance: 5, staffAttitude: 5, convenience: 5, processingTimeClarity: 5, overallSatisfaction: 5 } } as any,
      { ratings: { informationAccess: 5, procedureGuidance: 5, staffAttitude: 5, convenience: 5, processingTimeClarity: 5, overallSatisfaction: 5 } } as any,
    ];

    const stats = calculateStats(mockData);
    // (4+5+5) / 3 = 14 / 3 = 4.6666...
    expect(stats?.avgSatisfaction).toBe('4.67');
    expect(stats?.criterionAverages.informationAccess).toBe(4.67);
  });
});
