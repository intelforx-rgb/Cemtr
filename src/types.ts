export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type UserRole = 'Operations' | 'Project Management' | 'Sales & Marketing' | 'Procurement' | 'Erection & Commissioning' | 'Engineering & Design';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedRole: UserRole | 'General AI'; // Add General AI option
  uploadedFiles?: FileUpload[];
}

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadDate: Date;
}

export interface RegisterData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  isAuthenticated: boolean;
  registrationDate: Date;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  otpSent?: boolean;
  otp?: string; // For demo purposes
  sentTo?: string; // Email address where OTP was sent
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  role: UserRole | 'General AI'; // Can be any role: Operations, Project Management, Sales, etc., OR General AI
  createdAt: Date;
  lastUpdated: Date;
}

export interface ChatHistoryState {
  histories: ChatHistory[];
  currentChatId: string | null;
  maxHistories: number; // Set to 10
}

export interface LoginData {
  emailOrMobile: string;
  password: string;
}