import api from './api';

// API Service: Job Applications
export default {
    
    // Submit application
    applyForJob(data) {
        return api.post('/applications', data);
    },

    // Retrieve applications for a specific job
    getJobApplications(jobId) {
        return api.get(`/applications/job/${jobId}`);
    },

    // Retrieve user's application history
    getMyApplications() {
        return api.get('/applications/my-applications');
    },

    // Unlock applicant contact information
    unlockContact(applicationId) {
        return api.put(`/applications/unlock/${applicationId}`);
    }
};