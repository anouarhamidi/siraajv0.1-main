import { useEffect, useState } from 'react';
import { MapPin, Briefcase, Clock, Building2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Job } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

interface JobListProps {
  onJobClick: (job: Job) => void;
}

export function JobList({ onJobClick }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles!jobs_employer_id_fkey(*)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-[#38b6ff] focus:ring-2 focus:ring-[#38b6ff]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No jobs found matching your criteria</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onJobClick(job)}
              className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:border-[#38b6ff] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#38b6ff] transition-colors mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    {job.employer && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.employer.company_name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="px-3 py-1 bg-[#38b6ff]/10 text-[#38b6ff] text-xs font-semibold rounded-full">
                    {job.job_type}
                  </span>
                  {job.salary_range && (
                    <span className="text-sm font-medium text-slate-900">{job.salary_range}</span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
