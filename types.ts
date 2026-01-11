
export interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'water' | 'energy' | 'waste' | 'food' | 'transport';
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // ISO Date String YYYY-MM-DD
  completionHistory: string[]; // List of ISO Date Strings YYYY-MM-DD
}

export interface EcoFact {
  fact: string;
  impact: string;
}
