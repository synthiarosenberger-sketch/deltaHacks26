
import { UserStats } from '../types';
import { STORAGE_KEY } from '../constants';

const defaultStats: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  completionHistory: []
};

export const getStats = (): UserStats => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return defaultStats;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse storage data", e);
    return defaultStats;
  }
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const getTodayStr = () => {
  return new Date().toISOString().split('T')[0];
};

export const getYesterdayStr = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const checkAndUpdateStreakReset = (stats: UserStats): UserStats => {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  
  if (stats.lastCompletedDate && stats.lastCompletedDate !== today && stats.lastCompletedDate !== yesterday) {
    // Gap detected, reset streak
    return {
      ...stats,
      currentStreak: 0
    };
  }
  return stats;
};
