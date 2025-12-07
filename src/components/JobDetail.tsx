import { X, MapPin, Briefcase, Building2, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Job } from '../types/database';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface JobDetailProps {
  job: Job;
  onClose: () => void;
  onApplicationSubmitted?: () => void;
}

export function JobDetail({ job, onClose, onApplicationSubmitted }: JobDetailProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { profile } = useAuth();

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    setError('');

    try {
      const { error: applyError } = await supabase.from('applications').insert({
        job_id: job.id,
        graduate_id: profile.id,
        cover_letter: coverLetter,
      });

      if (applyError) throw applyError;

      setSuccess(true);
      setTimeout(() => {
        onApplicationSubmitted?.();
        onClose();
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {job.employer && (
            <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#38b6ff] to-[#2a8fd9] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{job.employer.company_name}</h3>
                <p className="text-sm text-slate-600">{job.employer.location}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-slate-600">
              <MapPin className="w-5 h-5 text-[#38b6ff]" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Briefcase className="w-5 h-5 text-[#38b6ff]" />
              <span className="capitalize">{job.job_type.replace('-', ' ')}</span>
            </div>
            {job.salary_range && (
              <div className="flex items-center space-x-2 text-slate-600">
                <DollarSign className="w-5 h-5 text-[#38b6ff]" />
                <span>{job.salary_range}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-slate-600">
              <Clock className="w-5 h-5 text-[#38b6ff]" />
              <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#38b6ff]/10 text-[#38b6ff] text-sm font-semibold rounded-full">
              {job.experience_level}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
              {job.status}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Job Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#38b6ff] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile?.user_type === 'graduate' && !success && (
            <div className="pt-6 border-t border-slate-200">
              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full py-3 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Apply for this Position
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all resize-none"
                      placeholder="Tell the employer why you're a great fit for this position..."
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Application Submitted!</p>
                <p className="text-sm text-green-700">The employer will review your application soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
