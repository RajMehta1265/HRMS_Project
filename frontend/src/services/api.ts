import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Result {
  success: boolean;
  message: string;
}

export interface DataResult<T> extends Result {
  data: T;
}

export interface City {
  id: number;
  cityName: string;
}

export interface JobPosition {
  id: number;
  title: string;
}

export interface Employer {
  id: number;
  companyName: string;
  companyWebPage: string;
  email: string;
  phoneNumber: string;
}

export interface JobSeeker {
  id: number;
  name: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  email: string;
}

export interface JobAdvertisement {
  id: number;
  jobTitle: string;
  companyName: string;
  city: string;
  openPositionCount: number;
  minSalary: number;
  maxSalary: number;
  releaseDate: string;
  applicationDeadline: string;
  active: boolean;
}

export interface JobApplication {
  id: number;
  applicationDate: string;
  status: string;
  jobSeekerName: string;
  jobSeekerLastName: string;
  jobSeekerEmail: string;
  jobPositionTitle: string;
  companyName: string;
  jobAdvertisementId: number;
}

export const apiService = {
  // Cities
  getCities: () => API.get<DataResult<City[]>>('/cities/getAll').then(res => res.data),
  addCity: (cityName: string) => API.post<Result>('/cities/add', { cityName }).then(res => res.data),

  // Job Positions
  getJobPositions: () => API.get<DataResult<JobPosition[]>>('/jobPosition/getAll').then(res => res.data),
  addJobPosition: (title: string) => API.post<Result>('/jobPosition/add', { title }).then(res => res.data),

  // Employers
  getEmployers: () => API.get<DataResult<Employer[]>>('/employers/getAll').then(res => res.data),
  registerEmployer: (data: any) => API.post<Result>('/employers/register', data).then(res => res.data),

  // Job Seekers (Candidates)
  getCandidates: () => API.get<DataResult<JobSeeker[]>>('/candidateController/getAll').then(res => res.data),
  registerCandidate: (data: any) => API.post<Result>('/candidateController/register', data).then(res => res.data),

  // Job Advertisements
  getJobAdvertisements: () => API.get<DataResult<JobAdvertisement[]>>('/jobPost/getAll').then(res => res.data),
  getActiveJobAdvertisements: () => API.get<DataResult<JobAdvertisement[]>>('/jobPost/active').then(res => res.data),
  addJobAdvertisement: (data: any) => API.post<Result>('/jobPost/add', data).then(res => res.data),

  // Job Applications
  applyForJob: (jobAdvertisementId: number, jobSeekerId: number) => 
    API.post<Result>('/applications/apply', { jobAdvertisementId, jobSeekerId }).then(res => res.data),
  getApplicationsByCandidate: (seekerId: number) => 
    API.get<DataResult<JobApplication[]>>(`/applications/by-jobseeker/${seekerId}`).then(res => res.data),
};
