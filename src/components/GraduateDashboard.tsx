import { useState, useEffect } from 'react';
import { FileText, Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Application } from '../types/database';

export function GraduateDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.user_type === 'graduate') {
      loadApplications();
    }
  }, [profile]);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*, employer:profiles!jobs_employer_id_fkey(*))
        `)
        .eq('graduate_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'reviewed':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
        <p className="text-slate-600">Track the status of your job applications</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#38b6ff]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#38b6ff]" />
            </div>
            <span className="text-slate-600 font-medium text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-slate-600 font-medium text-sm">Pending</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {applications.filter((a) => a.status === 'pending').length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-slate-600 font-medium text-sm">Reviewed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {applications.filter((a) => a.status === 'reviewed').length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-slate-600 font-medium text-sm">Accepted</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {applications.filter((a) => a.status === 'accepted').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Application History</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No applications yet. Start browsing jobs to apply!</p>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {application.job?.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {application.job?.employer?.company_name} • {application.job?.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : application.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-700'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>

                {application.cover_letter && (
                  <div className="mb-3 p-4 bg-slate-50 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Your Cover Letter</h5>
                    <p className="text-sm text-slate-600 line-clamp-3">{application.cover_letter}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Applied {new Date(application.created_at).toLocaleDateString()}
                  </span>
                  {application.status === 'accepted' && (
                    <span className="text-green-600 font-medium">
                      Congratulations! Contact the employer for next steps.
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
