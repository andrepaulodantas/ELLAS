export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type VisualizationType = 'TABLE' | 'MAP' | 'CHART';

export interface VisualizationState {
  type: VisualizationType;
  question: string;
  data: any[];
}

export interface EnhancedVisualizationState extends VisualizationState {
  filters: { [key: string]: string };
  sorting: { column: string; direction: 'asc' | 'desc' } | null;
  lastUpdated: number;
} 