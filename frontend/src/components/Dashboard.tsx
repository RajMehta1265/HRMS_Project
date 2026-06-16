import React, { useEffect, useState } from 'react';
import { 
  Briefcase, Users, Building2, MapPin, Plus, 
  DollarSign, X, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import type { JobAdvertisement, JobSeeker, Employer, City, JobPosition } from '../services/api';

type Tab = 'jobs' | 'candidates' | 'employers';
type ModalType = 'apply' | 'register_candidate' | 'register_employer' | 'add_job_ad' | 'add_city' | 'add_position' | null;

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });

  // Data states
  const [jobs, setJobs] = useState<JobAdvertisement[]>([]);
  const [candidates, setCandidates] = useState<JobSeeker[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);

  // Modal control
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Form states
  const [candidateForm, setCandidateForm] = useState({
    name: '', lastName: '', nationalId: '', birthDate: '', email: '', password: '', confirmPassword: ''
  });
  const [employerForm, setEmployerForm] = useState({
    companyName: '', companyWebPage: '', email: '', phoneNumber: '', password: '', confirmPassword: ''
  });
  const [jobAdForm, setJobAdForm] = useState({
    description: '', openPositionCount: 1, minSalary: 0, maxSalary: 0,
    applicationDeadline: '', jobPositionId: '', cityId: '', employerId: ''
  });
  const [newCityName, setNewCityName] = useState('');
  const [newPositionTitle, setNewPositionTitle] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [jobsData, candidatesData, employersData, citiesData, positionsData] = await Promise.all([
        apiService.getActiveJobAdvertisements().catch(() => ({ data: [] })),
        apiService.getCandidates().catch(() => ({ data: [] })),
        apiService.getEmployers().catch(() => ({ data: [] })),
        apiService.getCities().catch(() => ({ data: [] })),
        apiService.getJobPositions().catch(() => ({ data: [] })),
      ]);

      setJobs(jobsData.data || []);
      setCandidates(candidatesData.data || []);
      setEmployers(employersData.data || []);
      setCities(citiesData.data || []);
      setPositions(positionsData.data || []);
    } catch (err: any) {
      showToast('Error fetching database records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !selectedCandidateId) {
      showToast('Please select a candidate.', 'error');
      return;
    }
    try {
      const result = await apiService.applyForJob(selectedJobId, parseInt(selectedCandidateId));
      if (result.success) {
        showToast(result.message || 'Application submitted successfully!', 'success');
        setOpenModal(null);
        setSelectedCandidateId('');
      } else {
        showToast(result.message || 'Failed to submit application.', 'error');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit application.';
      showToast(errMsg, 'error');
    }
  };

  const handleRegisterCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateForm.password !== candidateForm.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    try {
      const result = await apiService.registerCandidate(candidateForm);
      if (result.success) {
        showToast(result.message || 'Candidate registered!', 'success');
        setOpenModal(null);
        setCandidateForm({
          name: '', lastName: '', nationalId: '', birthDate: '', email: '', password: '', confirmPassword: ''
        });
        loadAllData();
      } else {
        showToast(result.message || 'Registration failed.', 'error');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed.';
      showToast(errMsg, 'error');
    }
  };

  const handleRegisterEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employerForm.password !== employerForm.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    try {
      const result = await apiService.registerEmployer(employerForm);
      if (result.success) {
        showToast(result.message || 'Employer registered!', 'success');
        setOpenModal(null);
        setEmployerForm({
          companyName: '', companyWebPage: '', email: '', phoneNumber: '', password: '', confirmPassword: ''
        });
        loadAllData();
      } else {
        showToast(result.message || 'Registration failed.', 'error');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Employer registration failed.';
      showToast(errMsg, 'error');
    }
  };

  const handleAddJobAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...jobAdForm,
      jobPositionId: parseInt(jobAdForm.jobPositionId),
      cityId: parseInt(jobAdForm.cityId),
      employerId: parseInt(jobAdForm.employerId),
      openPositionCount: parseInt(jobAdForm.openPositionCount.toString()),
      minSalary: parseInt(jobAdForm.minSalary.toString()),
      maxSalary: parseInt(jobAdForm.maxSalary.toString()),
    };

    try {
      const result = await apiService.addJobAdvertisement(payload);
      if (result.success) {
        showToast(result.message || 'Job Advertisement posted!', 'success');
        setOpenModal(null);
        setJobAdForm({
          description: '', openPositionCount: 1, minSalary: 0, maxSalary: 0,
          applicationDeadline: '', jobPositionId: '', cityId: '', employerId: ''
        });
        loadAllData();
      } else {
        showToast(result.message || 'Failed to post job advertisement.', 'error');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to post job advertisement.';
      showToast(errMsg, 'error');
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiService.addCity(newCityName);
      if (result.success) {
        showToast('City added successfully!', 'success');
        setNewCityName('');
        setOpenModal(null);
        loadAllData();
      } else {
        showToast(result.message, 'error');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to add city.', 'error');
    }
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await apiService.addJobPosition(newPositionTitle);
      if (result.success) {
        showToast('Job Position added successfully!', 'success');
        setNewPositionTitle('');
        setOpenModal(null);
        loadAllData();
      } else {
        showToast(result.message, 'error');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to add position.', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header>
        <div className="logo-container">
          <div className="logo-icon">H</div>
          <span className="logo-text">HMRS Portal</span>
        </div>
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Job Postings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'employers' ? 'active' : ''}`}
            onClick={() => setActiveTab('employers')}
          >
            Employers
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{candidates.length}</div>
            <div className="stat-label">Candidates</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Building2 size={24} />
          </div>
          <div>
            <div className="stat-value">{employers.length}</div>
            <div className="stat-label">Employers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">
            <MapPin size={24} />
          </div>
          <div>
            <div className="stat-value">{cities.length}</div>
            <div className="stat-label">Cities Covered</div>
          </div>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="section-header">
        <h2 className="section-title">
          {activeTab === 'jobs' && 'Active Opportunities'}
          {activeTab === 'candidates' && 'Talent Pool'}
          {activeTab === 'employers' && 'Corporate Partners'}
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'jobs' && (
            <>
              <button className="btn-secondary" onClick={() => setOpenModal('add_city')}>
                <Plus size={16} /> Add City
              </button>
              <button className="btn-secondary" onClick={() => setOpenModal('add_position')}>
                <Plus size={16} /> Add Position
              </button>
              <button className="btn-primary" onClick={() => setOpenModal('add_job_ad')}>
                <Plus size={16} /> Post Job
              </button>
            </>
          )}
          {activeTab === 'candidates' && (
            <button className="btn-primary" onClick={() => setOpenModal('register_candidate')}>
              <Plus size={16} /> Register Candidate
            </button>
          )}
          {activeTab === 'employers' && (
            <button className="btn-primary" onClick={() => setOpenModal('register_employer')}>
              <Plus size={16} /> Register Employer
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={36} color="#6366f1" />
        </div>
      ) : (
        <>
          {activeTab === 'jobs' && (
            <div className="cards-grid">
              {jobs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No active jobs found. Post a new job advertisement to start.</p>
              ) : (
                jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div>
                      <div className="job-role">{job.jobTitle}</div>
                      <div className="job-company"><Building2 size={14} /> {job.companyName}</div>
                      <div className="job-tags">
                        <span className="tag tag-accent"><MapPin size={10} /> {job.city}</span>
                        <span className="tag">Positions: {job.openPositionCount}</span>
                        <span className="tag">Deadline: {job.applicationDeadline}</span>
                      </div>
                    </div>
                    <div className="job-footer">
                      <div className="job-salary">
                        <DollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        {job.minSalary ? `${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()} TRY` : 'Salary Not Disclosed'}
                      </div>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setOpenModal('apply');
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>National ID</th>
                    <th>Birth Date</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No candidates registered.</td>
                    </tr>
                  ) : (
                    candidates.map(candidate => (
                      <tr key={candidate.id}>
                        <td style={{ fontWeight: '500' }}>{candidate.name} {candidate.lastName}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.nationalId}</td>
                        <td>{candidate.birthDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'employers' && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Website</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No employers registered.</td>
                    </tr>
                  ) : (
                    employers.map(emp => (
                      <tr key={emp.id}>
                        <td style={{ fontWeight: '500' }}>{emp.companyName}</td>
                        <td>
                          <a href={emp.companyWebPage} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            {emp.companyWebPage}
                          </a>
                        </td>
                        <td>{emp.email}</td>
                        <td>{emp.phoneNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Apply Modal */}
      {openModal === 'apply' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Apply for Position</h3>
              <button className="close-btn" onClick={() => setOpenModal(null)}><X /></button>
            </div>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Select Candidate Profile</label>
                <select 
                  className="form-input"
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Candidate --</option>
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.lastName} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOpenModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add City Modal */}
      {openModal === 'add_city' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New City</h3>
              <button className="close-btn" onClick={() => setOpenModal(null)}><X /></button>
            </div>
            <form onSubmit={handleAddCity}>
              <div className="form-group">
                <label className="form-label">City Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Ankara" 
                  value={newCityName} 
                  onChange={(e) => setNewCityName(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOpenModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Add City</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Position Modal */}
      {openModal === 'add_position' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Job Position</h3>
              <button className="close-btn" onClick={() => setOpenModal(null)}><X /></button>
            </div>
            <form onSubmit={handleAddPosition}>
              <div className="form-group">
                <label className="form-label">Position Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Software Engineer" 
                  value={newPositionTitle} 
                  onChange={(e) => setNewPositionTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOpenModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Position</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Candidate Modal */}
      {openModal === 'register_candidate' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Register Candidate</h3>
              <button className="close-btn" onClick={() => setOpenModal(null)}><X /></button>
            </div>
            <form onSubmit={handleRegisterCandidate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" className="form-input" required 
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" className="form-input" required 
                    value={candidateForm.lastName}
                    onChange={(e) => setCandidateForm({...candidateForm, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">National ID (11 Digits)</label>
                  <input 
                    type="text" className="form-input" required maxLength={11}
                    value={candidateForm.nationalId}
                    onChange={(e) => setCandidateForm({...candidateForm, nationalId: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input 
                    type="date" className="form-input" required 
                    value={candidateForm.birthDate}
                    onChange={(e) => setCandidateForm({...candidateForm, birthDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" className="form-input" required 
                  value={candidateForm.email}
                  onChange={(e) => setCandidateForm({...candidateForm, email: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" className="form-input" required minLength={6}
                    value={candidateForm.password}
                    onChange={(e) => setCandidateForm({...candidateForm, password: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" className="form-input" required minLength={6}
                    value={candidateForm.confirmPassword}
                    onChange={(e) => setCandidateForm({...candidateForm, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOpenModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Employer Modal */}
      {openModal === 'register_employer' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Register Employer</h3>
              <button className="close-btn" onClick={() => setOpenModal(null)}><X /></button>
            </div>
            <form onSubmit={handleRegisterEmployer}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" className="form-input" required 
                    value={employerForm.companyName}
                    onChange={(e) => setEmployerForm({...employerForm, companyName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Website</label>
                  <input 
                    type="url" className="form-input" placeholder="https://example.com" required 
                    value={employerForm.companyWebPage}
                    onChange={(e) => setEmployerForm({...employerForm, companyWebPage: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Email</label>
                  <input 
                    type="email" className="form-input" required 
                    value={employerForm.email}
                    onChange={(e) => setEmployerForm({...employerForm, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" className="form-input" required placeholder="+90-555-..."
                    value={employerForm.phoneNumber}
                    onChange={(e) => setEmployerForm({...employerForm, phoneNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" className="form-input" required minLength={6}
                    value={employerForm.password}
                    onChange={(e) => setEmployerForm({...employerForm, password: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" className="form-input" required minLength={6}
                    value={employerForm.confirmPassword}
                    onChange={(e) => setEmployerForm({...employerForm, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOpenModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Register Corporate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Ad Modal */}
      {openModal === 'add_job_ad' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Post New Job</h3>
              <button className="close-btn" onClick={() => setOpenModal(null)}><X /></button>
            </div>
            <form onSubmit={handleAddJobAd}>
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea 
                  className="form-input" rows={4} style={{ resize: 'none' }} required 
                  placeholder="Describe the role requirements and details..."
                  value={jobAdForm.description}
                  onChange={(e) => setJobAdForm({...jobAdForm, description: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Job Position</label>
                  <select 
                    className="form-input" required
                    value={jobAdForm.jobPositionId}
                    onChange={(e) => setJobAdForm({...jobAdForm, jobPositionId: e.target.value})}
                  >
                    <option value="">-- Choose Position --</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location (City)</label>
                  <select 
                    className="form-input" required
                    value={jobAdForm.cityId}
                    onChange={(e) => setJobAdForm({...jobAdForm, cityId: e.target.value})}
                  >
                    <option value="">-- Choose City --</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>{c.cityName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Posting Employer</label>
                  <select 
                    className="form-input" required
                    value={jobAdForm.employerId}
                    onChange={(e) => setJobAdForm({...jobAdForm, employerId: e.target.value})}
                  >
                    <option value="">-- Choose Employer --</option>
                    {employers.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.companyName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Open Position Count</label>
                  <input 
                    type="number" className="form-input" required min={1}
                    value={jobAdForm.openPositionCount}
                    onChange={(e) => setJobAdForm({...jobAdForm, openPositionCount: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Min Salary (TRY)</label>
                  <input 
                    type="number" className="form-input" min={0}
                    value={jobAdForm.minSalary}
                    onChange={(e) => setJobAdForm({...jobAdForm, minSalary: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Salary (TRY)</label>
                  <input 
                    type="number" className="form-input" min={0}
                    value={jobAdForm.maxSalary}
                    onChange={(e) => setJobAdForm({...jobAdForm, maxSalary: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input 
                  type="date" className="form-input" required 
                  value={jobAdForm.applicationDeadline}
                  onChange={(e) => setJobAdForm({...jobAdForm, applicationDeadline: e.target.value})}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setOpenModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Post Advertisement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
