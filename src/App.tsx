import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { JobList } from './components/JobList';
import { JobDetail } from './components/JobDetail';
import { EmployerDashboard } from './components/EmployerDashboard';
import { GraduateDashboard } from './components/GraduateDashboard';
import { Job, UserType } from './types/database';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUserType, setAuthUserType] = useState<UserType>('graduate');
  const [currentView, setCurrentView] = useState<'landing' | 'jobs' | 'applications'>('landing');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleGetStarted = (userType: UserType) => {
    setAuthUserType(userType);
    setShowAuthModal(true);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#38b6ff] mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultUserType={authUserType}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header currentView={currentView} onNavigate={setCurrentView} />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {profile.user_type === 'employer' ? (
          <EmployerDashboard />
        ) : (
          <>
            {currentView === 'jobs' && (
              <JobList onJobClick={handleJobClick} />
            )}
            {currentView === 'applications' && (
              <GraduateDashboard />
            )}
          </>
        )}
      </main>

      {selectedJob && (
        <JobDetail
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplicationSubmitted={() => {
            setSelectedJob(null);
            setCurrentView('applications');
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
