import React from 'react';
import { Factory, BarChart3, TrendingUp, ShoppingCart, Wrench, Settings, Bot } from 'lucide-react';
import type { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface RoleSelectorProps {
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
}

const roles: { 
  value: UserRole | 'General AI'; 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
  description: string;
  requiresAuth?: boolean;
}[] = [
  { 
    value: 'Operations', 
    label: 'Operations & Maintenance', 
    icon: <Factory size={18} />, 
    color: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    description: 'Machinery troubleshooting & process optimization'
  },
  { 
    value: 'Project Management', 
    label: 'Project Management', 
    icon: <BarChart3 size={18} />, 
    color: 'border-blue-500 bg-blue-50 text-blue-700',
    description: 'EPC scheduling & resource planning'
  },
  { 
    value: 'Sales & Marketing', 
    label: 'Sales & Marketing', 
    icon: <TrendingUp size={18} />, 
    color: 'border-green-500 bg-green-50 text-green-700',
    description: 'Market analysis & customer strategies'
  },
  { 
    value: 'Procurement', 
    label: 'Procurement & Supply Chain', 
    icon: <ShoppingCart size={18} />, 
    color: 'border-purple-500 bg-purple-50 text-purple-700',
    description: 'Vendor negotiations & inventory optimization'
  },
  { 
    value: 'Erection & Commissioning', 
    label: 'Erection & Commissioning', 
    icon: <Wrench size={18} />, 
    color: 'border-red-500 bg-red-50 text-red-700',
    description: 'Installation sequencing & safety compliance'
  },
  { 
    value: 'Engineering & Design', 
    label: 'Engineering & Design', 
    icon: <Settings size={18} />, 
    color: 'border-orange-500 bg-orange-50 text-orange-700',
    description: 'Process flow design & equipment selection'
  },
  { 
    value: 'General AI', 
    label: 'General AI Assistant', 
    icon: <Bot size={18} />, 
    color: 'border-purple-500 bg-purple-50 text-purple-700',
    description: 'General purpose AI for any questions',
    requiresAuth: true // Only show for authenticated users
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-3">
      {roles
        .filter(role => !role.requiresAuth || isAuthenticated)
        .map((role) => (
          <button
            key={role.value}
            onClick={() => onRoleChange(role.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border-2 ${
              selectedRole === role.value
                ? `${role.color} shadow-lg transform scale-105`
                : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedRole === role.value ? 'bg-white/20' : 'bg-slate-700'}`}>
              {role.icon}
            </div>
            <div className="text-left flex-1">
              <div className={`font-bold text-sm ${selectedRole === role.value ? '' : 'text-white'}`}>
                {role.label}
              </div>
              <div className={`text-xs ${selectedRole === role.value ? 'opacity-80' : 'text-slate-400'}`}>
                {role.description}
              </div>
            </div>
            {selectedRole === role.value && (
              <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
            )}
          </button>
        ))}
    </div>
  );
};