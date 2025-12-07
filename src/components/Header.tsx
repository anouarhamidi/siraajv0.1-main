import { Briefcase, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('jobs')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38b6ff] to-[#2a8fd9] flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-transparent bg-clip-text">
              Siraaj
            </span>
          </button>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('jobs')}
              className={`font-medium transition-colors ${
                currentView === 'jobs' ? 'text-[#38b6ff]' : 'text-slate-600 hover:text-[#38b6ff]'
              }`}
            >
              {profile?.user_type === 'employer' ? 'Dashboard' : 'Browse Jobs'}
            </button>
            {profile?.user_type === 'graduate' && (
              <button
                onClick={() => onNavigate('applications')}
                className={`font-medium transition-colors ${
                  currentView === 'applications'
                    ? 'text-[#38b6ff]'
                    : 'text-slate-600 hover:text-[#38b6ff]'
                }`}
              >
                My Applications
              </button>
            )}

            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#38b6ff]/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#38b6ff]" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{profile?.full_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{profile?.user_type}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
