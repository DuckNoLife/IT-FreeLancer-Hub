import api from './api';

// API Service: Job Management
export default {
    
    // Fetch all jobs (with optional filters)
    getAllJobs(params) {
        return api.get('/jobs', { params });
    },
    
    // Fetch jobs posted by the current user (Client)
    getMyJobs() {
        return api.get('/jobs/my-jobs');
    },
    
    // Fetch single job details
    getJobById(id) {
        return api.get(`/jobs/${id}`);
    },
    
    // Create new job listing
    createJob(data) {
        return api.post('/jobs', data);
    },
    
    // Close job and mark freelancer as hired (reputation update)
    closeJob(jobId, freelancerId) {
        return api.put(`/jobs/close/${jobId}/${freelancerId}`); 
    },
    
    // Close job without hiring
    closeJobOnly(id) {
        return api.put(`/jobs/${id}/close`);
    }
};