import type { ChatHistory, Message, UserRole } from '../types';

export class ChatHistoryService {
  private static readonly MAX_HISTORIES = 10;

  // Save chat history for authenticated user
  static saveChatHistory(userId: string, chatData: {
    title?: string;
    messages: Message[];
    role: UserRole | 'General AI';
  }): ChatHistory {
    // Auto-generate title from first user message
    const title = chatData.title || 
      chatData.messages.find(m => m.role === 'user')?.content.substring(0, 30) + '...' || 
      'New Chat';

    // Create new chat history with role information
    const newHistory: ChatHistory = {
      id: `chat_${Date.now()}`,
      title,
      messages: chatData.messages,
      role: chatData.role, // Store which role was used for this conversation
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    // Get existing histories (from ALL roles)
    const histories = this.getChatHistories(userId);

    // Add new history and maintain 10 total limit across ALL roles
    const updatedHistories = [newHistory, ...histories].slice(0, this.MAX_HISTORIES);

    // Save to localStorage
    localStorage.setItem(`chat_histories_${userId}`, JSON.stringify(updatedHistories));

    return newHistory;
  }

  // Get all chat histories for user
  static getChatHistories(userId: string): ChatHistory[] {
    const stored = localStorage.getItem(`chat_histories_${userId}`);
    if (!stored) return [];

    const histories = JSON.parse(stored);
    // Convert date strings back to Date objects
    return histories.map((h: any) => ({
      ...h,
      createdAt: new Date(h.createdAt),
      lastUpdated: new Date(h.lastUpdated)
    }));
  }

  // Delete specific chat history
  static deleteChatHistory(userId: string, chatId: string): void {
    const histories = this.getChatHistories(userId).filter(h => h.id !== chatId);
    localStorage.setItem(`chat_histories_${userId}`, JSON.stringify(histories));
  }

  // Clear all chat histories for user
  static clearAllHistories(userId: string): void {
    localStorage.removeItem(`chat_histories_${userId}`);
  }

  // Get specific chat history by ID
  static getChatHistory(userId: string, chatId: string): ChatHistory | null {
    const histories = this.getChatHistories(userId);
    return histories.find(h => h.id === chatId) || null;
  }

  // Update existing chat history
  static updateChatHistory(userId: string, chatId: string, messages: Message[]): void {
    const histories = this.getChatHistories(userId);
    const historyIndex = histories.findIndex(h => h.id === chatId);
    
    if (historyIndex !== -1) {
      histories[historyIndex].messages = messages;
      histories[historyIndex].lastUpdated = new Date();
      localStorage.setItem(`chat_histories_${userId}`, JSON.stringify(histories));
    }
  }
}