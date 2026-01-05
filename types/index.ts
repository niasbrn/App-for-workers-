// Worker and Task Types

export interface Worker {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  phone: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: Worker;
  location: Location;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  progress: number; // 0-100
  photos: WorkPhoto[];
  estimatedHours: number;
  actualHours?: number;
}

export interface WorkPhoto {
  id: string;
  uri: string | number; // string for URL, number for require() local images
  timestamp: string;
  caption?: string;
  aiVerified: boolean;
  aiAnalysis?: AIAnalysisResult;
  taskId: string;
}

export interface AIAnalysisResult {
  confidence: number; // 0-100
  workDetected: boolean;
  category: string;
  details: string[];
  suggestions?: string[];
  verificationStatus: 'verified' | 'needs_review' | 'rejected';
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  photosUploaded: number;
  hoursWorked: number;
  aiVerifications: number;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'photo_verified' | 'reminder' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
}

