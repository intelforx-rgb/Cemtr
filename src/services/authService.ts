import type { User, RegisterData, LoginData, OTPResponse } from '../types';

export class AuthService {
  private static users: Map<string, User & { password: string }> = new Map();
  private static otpStore: Map<string, { otp: string; expires: number }> = new Map();

  // Generate random 6-digit OTP
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Mock Email OTP sending service
  static async sendOTP(email: string): Promise<OTPResponse> {
    const otp = this.generateOTP();
    const expires = Date.now() + 60000; // 1 minute expiry
    
    this.otpStore.set(email, { otp, expires });
    
    // Log OTP to console and show alert for demo purposes
    console.log(`📧 Email OTP sent to ${email}: ${otp}`);
    alert(`Demo Mode - OTP sent to ${email}\nYour verification code: ${otp}\n(In production, this would be sent via email)`);
    
    return {
      success: true,
      message: `Verification code sent to ${email}`,
      otpSent: true,
      otp, // Include for demo purposes
      sentTo: email
    };
  }

  // Verify OTP
  static async verifyOTP(email: string, otp: string): Promise<boolean> {
    const stored = this.otpStore.get(email);
    
    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expires) {
      this.otpStore.delete(email);
      return false;
    }

    if (stored.otp === otp) {
      this.otpStore.delete(email);
      return true;
    }

    return false;
  }

  // Register new user
  static async register(userData: RegisterData): Promise<User> {
    const userId = `user_${Date.now()}`;
    const user: User = {
      id: userId,
      fullName: userData.fullName,
      email: userData.email,
      mobile: userData.mobile,
      isAuthenticated: true,
      registrationDate: new Date()
    };

    // Store user with password (in real app, hash the password)
    this.users.set(userData.email, { ...user, password: userData.password });
    this.users.set(userData.mobile, { ...user, password: userData.password });

    // Persist to localStorage
    const existingUsers = JSON.parse(localStorage.getItem('cemtras_users') || '[]');
    existingUsers.push({ ...user, password: userData.password });
    localStorage.setItem('cemtras_users', JSON.stringify(existingUsers));

    return user;
  }

  // Login user
  static async login(credentials: LoginData): Promise<User | null> {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('cemtras_users') || '[]');
    storedUsers.forEach((user: User & { password: string }) => {
      this.users.set(user.email, user);
      this.users.set(user.mobile, user);
    });

    const user = this.users.get(credentials.emailOrMobile);
    
    if (!user || user.password !== credentials.password) {
      return null;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      isAuthenticated: true,
      registrationDate: user.registrationDate
    };
  }

  // Get current user from localStorage
  static getCurrentUser(): User | null {
    const userData = localStorage.getItem('cemtras_current_user');
    return userData ? JSON.parse(userData) : null;
  }

  // Save current user to localStorage
  static saveCurrentUser(user: User): void {
    localStorage.setItem('cemtras_current_user', JSON.stringify(user));
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem('cemtras_current_user');
  }
}