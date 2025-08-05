export type CommuteMode = 'Walk' | 'Drive' | 'Bus' | 'Train';

export interface Location {
  id: string;
  name: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CommuteModeOption {
  id: CommuteMode;
  label: string;
  icon: string;
  color: string;
  duration: number;
}

export interface PlannerFormData {
  commuteMode: CommuteMode | null;
  startLocation: Location | null;
  destinationLocation: Location | null;
  arrivalTime: Date | null;
}

export interface LeaveTimeResult {
  arrivalTime: Date;
  leaveTime: Date;
  commuteMode: CommuteMode;
  duration: number;
  startLocation: Location;
  destinationLocation: Location;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderMinutes: number;
  sound: boolean;
  vibration: boolean;
}

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  Planner: undefined;
  Result: { result: LeaveTimeResult };
  Settings: undefined;
};

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  spring?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
} 