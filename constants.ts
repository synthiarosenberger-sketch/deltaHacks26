
import { Task } from './types';

export const TASKS: Task[] = [
  { id: '1', title: 'Reusable Bottle', description: 'Use a reusable water bottle all day instead of single-use plastic.', icon: '💧', category: 'waste' },
  { id: '2', title: 'Sustainable Transit', description: 'Walk, cycle, or take public transport instead of driving a car.', icon: '🚲', category: 'transport' },
  { id: '3', title: 'Plant-Based Day', description: 'Eat entirely plant-based meals today to reduce your carbon footprint.', icon: '🥗', category: 'food' },
  { id: '4', title: 'Energy Saver', description: 'Turn off all unused electronics and lights when leaving a room.', icon: '💡', category: 'energy' },
  { id: '5', title: 'No Plastic Bags', description: 'Use your own reusable bags for any shopping today.', icon: '🛍️', category: 'waste' },
  { id: '6', title: 'Short Shower', description: 'Keep your shower under 5 minutes to conserve water.', icon: '🚿', category: 'water' },
  { id: '7', title: 'Compost Scraps', description: 'Compost your organic food waste today.', icon: '♻️', category: 'waste' },
  { id: '8', title: 'Local Produce', description: 'Buy at least one item from a local farmer or market.', icon: '🍎', category: 'food' },
  { id: '9', title: 'Unplug Chargers', description: 'Unplug phone and laptop chargers when not in use.', icon: '🔌', category: 'energy' },
  { id: '10', title: 'Cold Wash', description: 'Do a load of laundry using cold water to save heating energy.', icon: '👕', category: 'energy' },
];

export const STORAGE_KEY = 'sustainability_streak_data';

export const COLORS = {
  primary: '#1CB0F6', // Blue
  secondary: '#58CC02', // Green
  accent: '#FF9600', // Orange
  dark: '#4B4B4B',
  gray: '#AFAFAF',
  lightGray: '#E5E5E5'
};
