import { CommuteMode, LeaveTimeResult } from '../types';

// Mock commute duration estimates (in minutes)
const COMMUTE_DURATIONS: Record<CommuteMode, number> = {
  Walk: 15,
  Drive: 10,
  Bus: 25,
  Train: 20,
};

export const estimateLeaveTime = (
  arrivalTime: Date,
  commuteMode: CommuteMode
): LeaveTimeResult => {
  const duration = COMMUTE_DURATIONS[commuteMode];
  
  // Calculate leave time by subtracting duration from arrival time
  const leaveTime = new Date(arrivalTime.getTime() - duration * 60 * 1000);
  
  return {
    arrivalTime,
    leaveTime,
    commuteMode,
    duration,
  };
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}; 