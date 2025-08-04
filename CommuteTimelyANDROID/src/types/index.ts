export type CommuteMode = 'Walk' | 'Drive' | 'Bus' | 'Train';

export interface Location {
  name: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PlannerFormData {
  commuteMode: CommuteMode;
  startLocation: Location;
  destinationLocation: Location;
  arrivalTime: Date;
}

export interface LeaveTimeResult {
  arrivalTime: Date;
  leaveTime: Date;
  commuteMode: CommuteMode;
  duration: number; // in minutes
}

export type RootStackParamList = {
  Home: undefined;
  Planner: undefined;
  Result: { result: LeaveTimeResult };
}; 