import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Film, 
  BarChart3, 
  Calendar, 
  Camera, 
  FileText, 
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  user: UserType;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ user, currentView, onViewChange, onLogout }: SidebarProps) {
  const getMenuItems = () => {
    switch (user.role) {
      case 'OWNER':
        return [
          { id: 'executive', label: 'Executive Dashboard', icon: BarChart3 },
          { id: 'projects', label: 'Project Overview', icon: Film },
          { id: 'settings', label: 'System Settings', icon: Settings }
        ];
      case 'MANAGER':
        return [
          { id: 'logistics', label: 'Logistics Dashboard', icon: Calendar },
          { id: 'vendors', label: 'Vendor Management', icon: BarChart3 },
          { id: 'schedule', label: 'Schedule Planning', icon: Calendar }
        ];
      case 'EXECUTOR':
        return [
          { id: 'field', label: 'Field Operations', icon: Camera },
          { id: 'reports', label: 'Daily Reports', icon: FileText },
          { id: 'callsheet', label: 'Call Sheet', icon: Calendar }
        ];
      case 'CREATIVE':
        return [
          { id: 'creative', label: 'Creative Control', icon: Film },
          { id: 'script', label: 'Script Management', icon: FileText },
          { id: 'review', label: 'Schedule Review', icon: Calendar }
        ];
      default:
        return [];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'border-cyan-500 text-cyan-400';
      case 'MANAGER': return 'border-amber-500 text-amber-400';
      case 'EXECUTOR': return 'border-green-500 text-green-400';
      case 'CREATIVE': return 'border-purple-500 text-purple-400';
      default: return 'border-slate-500 text-slate-400';
    }
  };

  const menuItems = getMenuItems();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-slate-900 border-r border-slate-700 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Film className="h-8 w-8 text-cyan-400" />
          <h1 className="text-xl text-cyan-400 font-mono">SHOTWEAVE</h1>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-white text-sm">{user.name}</span>
          </div>
          <Badge variant="outline" className={getRoleColor(user.role)}>
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Button
                variant={currentView === item.id ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  currentView === item.id 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
}