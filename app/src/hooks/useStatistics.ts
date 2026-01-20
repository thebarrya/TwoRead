import { useEffect } from 'react';
import { useStatisticsStore } from '../services/statisticsStore';
import { useAuthStore } from '../services/authStore';

export const useStatistics = () => {
  const { user } = useAuthStore();
  const {
    overview,
    weeklyData,
    monthlyData,
    allTimeData,
    bookAnalytics,
    isLoading,
    error,
    fetchOverview,
    fetchWeekly,
    fetchMonthly,
    fetchAllTime,
    fetchBookAnalytics,
    refresh,
  } = useStatisticsStore();

  useEffect(() => {
    if (user?.id) {
      // Initial fetch
      fetchOverview(user.id);
      fetchWeekly(user.id);
    }
  }, [user?.id]);

  const refreshAll = async () => {
    if (user?.id) {
      await refresh(user.id);
    }
  };

  const loadMonthly = async () => {
    if (user?.id && !monthlyData) {
      await fetchMonthly(user.id);
    }
  };

  const loadAllTime = async () => {
    if (user?.id && !allTimeData) {
      await fetchAllTime(user.id);
    }
  };

  const loadBookAnalytics = async () => {
    if (user?.id && !bookAnalytics) {
      await fetchBookAnalytics(user.id);
    }
  };

  return {
    overview,
    weeklyData,
    monthlyData,
    allTimeData,
    bookAnalytics,
    isLoading,
    error,
    refreshAll,
    loadMonthly,
    loadAllTime,
    loadBookAnalytics,
  };
};
