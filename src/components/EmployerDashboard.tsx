import { useState, useEffect } from 'react';
import { Plus, Briefcase, Users, Eye, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Job, Application } from '../types/database';

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary_range: '',
    job_type: 'full-time' as const,
  });

  useEffect(() => {
    if (profile?.user_type === 'employer') {
      loadJobs();
      loadApplications();
    }
  }, [profile]);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(*),
          graduate:profiles!applications_graduate_id_fkey(*)
        `)
        .in('job_id', jobs.map((j) => j.id));

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const requirements = formData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r);

      const { error } = await supabase.from('jobs').insert({
        employer_id: profile.id,
        title: formData.title,
        description: formData.description,
        requirements,
        location: formData.location,
        salary_range: formData.salary_range || null,
        job_type: formData.job_type,
      });

      if (error) throw error;

      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary_range: '',
        job_type: 'full-time',
      });
      setShowJobForm(false);
      loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      loadApplications();
    } catch (error) {
      console.error('Error updating application:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employer Dashboard</h2>
          <p className="text-slate-600">Manage your job postings and applications</p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#38b6ff]/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#38b6ff]" />
            </div>
            <span className="text-slate-600 font-medium">Active Jobs</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{jobs.filter((j) => j.status === 'open').length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-slate-600 font-medium">Total Applications</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{applications.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-slate-600 font-medium">Pending Review</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {applications.filter((a) => a.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Your Job Postings</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No jobs posted yet. Create your first job posting!</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h4>
                    <p className="text-sm text-slate-600">{job.location} • {job.job_type}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {applications.filter((a) => a.job_id === job.id).length} applications
                  </span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-[#38b6ff] hover:underline text-sm font-medium"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showJobForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Post a New Job</h3>
              <button
                onClick={() => setShowJobForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Requirements (one per line)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all resize-none"
                  placeholder="Bachelor's degree&#10;2+ years experience&#10;Strong communication skills"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Salary Range (optional)
                </label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="e.g., $40,000 - $60,000"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#38b6ff] to-[#2a8fd9] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Post Job
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">Applications for {selectedJob.title}</h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {applications.filter((a) => a.job_id === selectedJob.id).length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications
                    .filter((a) => a.job_id === selectedJob.id)
                    .map((application) => (
                      <div key={application.id} className="border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              {application.graduate?.full_name}
                            </h4>
                            <p className="text-sm text-slate-600">{application.graduate?.email}</p>
                            {application.graduate?.location && (
                              <p className="text-sm text-slate-600">{application.graduate.location}</p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              application.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : application.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>

                        {application.cover_letter && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Cover Letter</h5>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {application.cover_letter}
                            </p>
                          </div>
                        )}

                        {application.graduate?.skills && application.graduate.skills.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Skills</h5>
                            <div className="flex flex-wrap gap-2">
                              {application.graduate.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-[#38b6ff]/10 text-[#38b6ff] text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'reviewed')}
                            disabled={application.status === 'reviewed'}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                            disabled={application.status === 'accepted'}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                            disabled={application.status === 'rejected'}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
