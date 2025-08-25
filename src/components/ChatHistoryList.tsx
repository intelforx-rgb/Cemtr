import React, { useState } from 'react';
import { MessageSquare, Trash2, Plus, Factory, BarChart3, TrendingUp, ShoppingCart, Wrench, Settings, Bot, Calendar } from 'lucide-react';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useAuth } from '../contexts/AuthContext';
import type { ChatHistory, UserRole } from '../types';

interface ChatHistoryListProps {
  onLoadChat: (history: ChatHistory) => void;
  onNewChat: () => void;
}

const getRoleIcon = (role: UserRole | 'General AI') => {
  switch (role) {
    case 'Operations': return <Factory size={14} />;
    case 'Project Management': return <BarChart3 size={14} />;
    case 'Sales & Marketing': return <TrendingUp size={14} />;
    case 'Procurement': return <ShoppingCart size={14} />;
    case 'Erection & Commissioning': return <Wrench size={14} />;
    case 'Engineering & Design': return <Settings size={14} />;
    case 'General AI': return <Bot size={14} />;
    default: return <MessageSquare size={14} />;
  }
};

const getRoleColor = (role: UserRole | 'General AI') => {
  switch (role) {
    case 'Operations': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'Project Management': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Sales & Marketing': return 'bg-green-100 text-green-700 border-green-300';
    case 'Procurement': return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'Erection & Commissioning': return 'bg-red-100 text-red-700 border-red-300';
    case 'Engineering & Design': return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'General AI': return 'bg-purple-100 text-purple-700 border-purple-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getRoleEmoji = (role: UserRole | 'General AI') => {
  switch (role) {
    case 'Operations': return '🏭'; // Operations & Maintenance
    case 'Project Management': return '📊'; // Project Management
    case 'Sales & Marketing': return '📈'; // Sales & Marketing
    case 'Procurement': return '🛒'; // Procurement & Supply Chain
    case 'Erection & Commissioning': return '🔧'; // Erection & Commissioning
    case 'Engineering & Design': return '⚙️'; // Engineering & Design
    case 'General AI': return '🤖'; // General AI
    default: return '💬';
  }
};

export const ChatHistoryList: React.FC<ChatHistoryListProps> = ({ onLoadChat, onNewChat }) => {
  const { histories, deleteChatHistory } = useChatHistory();
  const { isAuthenticated } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-xl border-2 border-slate-600">
        <p className="text-slate-400 text-sm text-center">
          Login to save and access chat history
        </p>
      </div>
    );
  }

  const handleDelete = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirm === chatId) {
      deleteChatHistory(chatId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(chatId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-4">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800
                 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300
                 shadow-lg hover:shadow-xl font-semibold"
      >
        <Plus size={18} />
        New Chat
      </button>

      {/* Chat History Header */}
      <div className="flex items-center gap-2 px-2">
        <MessageSquare className="text-slate-400" size={16} />
        <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Chat History ({histories.length}/10)
        </h4>
      </div>

      {/* Chat History List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {histories.length === 0 ? (
          <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-600 text-center">
            <p className="text-slate-400 text-sm">No chat history yet</p>
            <p className="text-slate-500 text-xs mt-1">Start a conversation to save it here</p>
          </div>
        ) : (
          histories.map((history) => (
            <div
              key={history.id}
              onClick={() => onLoadChat(history)}
              className="group relative bg-slate-800/50 hover:bg-slate-700/50 rounded-xl p-3 border border-slate-600
                       hover:border-slate-500 transition-all duration-300 cursor-pointer"
            >
              {/* Role Badge */}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold mb-2 border ${getRoleColor(history.role)}`}>
                {getRoleEmoji(history.role)}
                <span className="hidden sm:inline">{history.role}</span>
              </div>

              {/* Chat Title */}
              <h5 className="text-white font-semibold text-sm mb-1 pr-8 line-clamp-2">
                {history.title}
              </h5>

              {/* Date and Message Count */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>{formatDate(history.createdAt)}</span>
                </div>
                <span>{history.messages.length} messages</span>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(history.id, e)}
                className={`absolute top-2 right-2 p-1 rounded-lg transition-all duration-300 ${
                  deleteConfirm === history.id
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-red-600 hover:text-white opacity-0 group-hover:opacity-100'
                }`}
                title={deleteConfirm === history.id ? 'Click again to confirm' : 'Delete chat'}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Storage Info */}
      <div className="px-2 py-1">
        <div className="w-full bg-slate-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-blue-500 to-yellow-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(histories.length / 10) * 100}%` }}
          ></div>
        </div>
        <p className="text-slate-500 text-xs mt-1 text-center">
          {10 - histories.length} slots remaining
        </p>
      </div>
    </div>
  );
};