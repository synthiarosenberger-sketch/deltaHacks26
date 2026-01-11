
import React, { useState, useEffect, useMemo } from 'react';
import { TASKS, COLORS } from './constants';
import { UserStats, Task, EcoFact } from './types';
import { getStats, saveStats, getTodayStr, checkAndUpdateStreakReset } from './services/storageService';
import { getEcoFact } from './services/geminiService';

// Sub-components defined inside for scope safety as per guidelines
const StreakIcon = ({ current }: { current: number }) => (
  <div className="flex flex-col items-center">
    <div className="relative animate-fire">
      <span className="text-7xl">🔥</span>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-orange-500 font-extrabold text-orange-600 shadow-sm">
        {current}
      </div>
    </div>
    <p className="mt-4 text-gray-500 font-bold uppercase tracking-wider text-xs">Day Streak</p>
  </div>
);

const DailyCalendar = ({ history }: { history: string[] }) => {
  const last7Days = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  return (
    <div className="flex gap-2 justify-center mt-6">
      {last7Days.map(date => {
        const isCompleted = history.includes(date);
        const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' });
        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              isCompleted ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}>
              {isCompleted ? '✓' : ''}
            </div>
            <span className="text-xs font-bold text-gray-400">{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
};

const TaskDisplay = ({ task, isCompleted, onComplete, loading }: { 
  task: Task, 
  isCompleted: boolean, 
  onComplete: () => void,
  loading: boolean
}) => (
  <div className="duo-card bg-white p-6 rounded-2xl w-full max-w-md mx-auto">
    <div className="flex items-start gap-4">
      <div className="text-4xl p-3 bg-blue-50 rounded-2xl">{task.icon}</div>
      <div className="flex-1">
        <h3 className="text-xl font-extrabold text-gray-700">{task.title}</h3>
        <p className="text-gray-500 leading-tight mt-1">{task.description}</p>
      </div>
    </div>
    <button
      disabled={isCompleted || loading}
      onClick={onComplete}
      className={`w-full mt-6 py-4 rounded-2xl font-extrabold text-lg uppercase tracking-wide transition-all transform active:scale-95 ${
        isCompleted 
        ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed shadow-none' 
        : 'bg-[#58CC02] text-white duo-button duo-button-green'
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : isCompleted ? 'Challenge Done!' : 'I completed today\'s challenge'}
    </button>
  </div>
);

const EcoFactCard = ({ fact }: { fact: EcoFact }) => (
  <div className="mt-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl text-blue-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">✨</span>
      <h4 className="font-bold text-sm uppercase">AI Eco-Tip</h4>
    </div>
    <p className="text-sm italic mb-2">"{fact.fact}"</p>
    <div className="text-sm font-bold bg-blue-100 p-2 rounded-lg">
      🌍 Impact: {fact.impact}
    </div>
  </div>
);

export default function App() {
  const [stats, setStats] = useState<UserStats>(getStats());
  const [ecoFact, setEcoFact] = useState<EcoFact | null>(null);
  const [loading, setLoading] = useState(false);

  // Derive daily task from date (seeded)
  const dailyTask = useMemo(() => {
    const today = getTodayStr();
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TASKS[hash % TASKS.length];
  }, []);

  useEffect(() => {
    const updated = checkAndUpdateStreakReset(getStats());
    setStats(updated);
    saveStats(updated);
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    const today = getTodayStr();
    
    // Safety check
    if (stats.lastCompletedDate === today) return;

    const newCurrent = stats.currentStreak + 1;
    const newLongest = Math.max(stats.longestStreak, newCurrent);
    
    const newStats: UserStats = {
      ...stats,
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastCompletedDate: today,
      completionHistory: [...stats.completionHistory, today]
    };

    setStats(newStats);
    saveStats(newStats);

    // Fetch AI Fact
    const fact = await getEcoFact(dailyTask);
    if (fact) setEcoFact(fact);
    setLoading(false);
  };

  const isCompletedToday = stats.lastCompletedDate === getTodayStr();

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-10 bg-white p-4 rounded-2xl duo-card">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h1 className="text-xl font-extrabold text-[#58CC02] tracking-tight">Sustainability Streak</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 font-extrabold text-orange-500">
            <span>🔥</span>
            <span>{stats.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 font-extrabold text-blue-400">
            <span>🏆</span>
            <span>{stats.longestStreak}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center">
        <StreakIcon current={stats.currentStreak} />
        
        {/* Progress Bar to next Milestone */}
        <div className="w-full max-w-md mt-10 mb-8">
          <div className="flex justify-between text-xs font-extrabold text-gray-400 uppercase mb-1">
            <span>Progress to Next Goal</span>
            <span>{stats.currentStreak % 7}/7 Days</span>
          </div>
          <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-400 transition-all duration-700 ease-out"
              style={{ width: `${(stats.currentStreak % 7) / 7 * 100}%` }}
            />
          </div>
        </div>

        <TaskDisplay 
          task={dailyTask} 
          isCompleted={isCompletedToday} 
          onComplete={handleComplete}
          loading={loading}
        />

        {ecoFact && <EcoFactCard fact={ecoFact} />}

        <DailyCalendar history={stats.completionHistory} />

        {/* Motivation Text */}
        <p className="mt-12 text-gray-400 text-center font-bold text-sm max-w-xs">
          {isCompletedToday 
            ? "Amazing! You've done your part for the Earth today. See you tomorrow!" 
            : "The planet needs heroes like you. Complete today's challenge to keep your streak alive!"}
        </p>
      </main>

      {/* Footer / Info */}
      <footer className="mt-auto pt-10 text-gray-300 text-xs text-center font-bold">
        MADE FOR A GREENER FUTURE • SUSTAINABILITY STREAK v1.0
      </footer>
    </div>
  );
}
