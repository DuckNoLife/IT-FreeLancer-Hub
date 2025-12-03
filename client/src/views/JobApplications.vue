<template>
  <div class="container py-5">
    <div class="d-flex align-items-center mb-4">
      
      <!-- Back Button -->
      <router-link to="/my-jobs" class="btn btn-outline-gold btn-sm me-3 fw-bold rounded-pill px-4">
        <i class="fas fa-arrow-left me-1"></i> Back to Dashboard
      </router-link>
      
      <!-- Page Title & Job Status -->
      <h2 v-if="jobTitle" class="fw-bolder text-gold-highlight mb-0 page-title-apps">
        Applications for: {{ jobTitle }}
        <span 
          class="badge ms-3 fw-bold status-indicator-badge" 
          :class="isJobClosed ? 'bg-secondary-dark' : 'bg-success-dark'"
        >
          Job Status: {{ isJobClosed ? 'CLOSED' : 'OPEN' }}
        </span>
      </h2>
    </div>

    <hr class="luxury-divider mb-5">

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-gold" role="status" style="width: 3.5rem; height: 3.5rem;"></div>
      <p class="text-muted-light mt-3 fs-5">Loading elite applications...</p>
    </div>

    <!-- NO DATA STATE -->
    <div v-else-if="applications.length === 0" class="text-center py-5 card luxury-card-enhanced">
      <i class="fas fa-inbox text-gold-faded mb-3" style="font-size: 4rem;"></i>
      <h5 class="mt-3 text-light-high">No Applications Yet</h5>
      <p class="text-muted-light">No freelancers have applied for this job listing. Share the link to attract more talent!</p>
    </div>

    <!-- APPLICATIONS LIST -->
    <div v-else class="row g-4">
      <div class="col-lg-12" v-for="app in applications" :key="app._id">
        <div class="card luxury-card-enhanced shadow-xl application-card">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start">
              
              <!-- FREELANCER INFO (LEFT) -->
              <div>
                <h5 class="fw-bolder text-gold mb-1 freelancer-name">
                  <i class="fas fa-user-circle me-2"></i>{{ app.freelancerId?.username || 'N/A' }}
                  <i v-if="app.freelancerId?.isPro" class="fas fa-star text-gold ms-1 pro-indicator" title="Pro Freelancer"></i>
                </h5>
                <p class="text-muted-light small mb-2">
                  Reputation: <span class="fw-bold text-success-gold">{{ app.freelancerId?.reputation || 0 }}</span> points
                </p>
                <div class="skill-tags">
                  <span v-for="(skill, index) in app.freelancerId?.skills" :key="index" class="badge bg-dark-skill text-gold-faded me-1 border border-gold-subtle skill-badge-app">
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- STATUS & ACTIONS (RIGHT) -->
              <div class="text-end flex-shrink-0">
                <span 
                  class="badge fw-bold p-2 mb-2 status-badge-app"
                  :class="{ 
                    'bg-warning-dark': app.status === 'pending', 
                    'bg-success-dark-glow': app.status === 'contacting',
                    'bg-danger-dark': app.status === 'rejected'
                  }"
                >
                  {{ app.status.toUpperCase() }}
                </span>
                
                <!-- UNLOCK CONTACT BUTTON -->
                <button 
                  v-if="app.status === 'pending' && !isJobClosed"
                  class="btn btn-gold btn-sm fw-bold mt-2 unlock-btn"
                  @click="unlockContact(app._id)"
                  :disabled="isUnlocking"
                >
                  <span v-if="isUnlocking" class="spinner-border spinner-border-sm me-1"></span>
                  <i class="fas fa-lock-open me-1"></i> Unlock Contact
                </button>

                <!-- MARK AS HIRED BUTTON -->
                <button 
                  v-if="app.status === 'contacting' && !isJobClosed"
                  class="btn btn-outline-danger-dark btn-sm fw-bold mt-2"
                  @click="markAsHiredAndClose(app.freelancerId?._id)" :disabled="isUnlocking"
                >
                  <i class="fas fa-gavel me-1"></i> Mark as Hired & Close
                </button>

                <!-- HIRED STATUS -->
                <span v-else-if="isJobClosed && app.status === 'contacting'" class="text-success-gold small fw-bold mt-2 d-block">
                  <i class="fas fa-check-double me-1"></i> JOB HIRED
                </span>
              </div>
            </div>

            <hr class="luxury-divider mt-4 mb-4">

            <!-- COVER LETTER -->
            <h6 class="fw-bold text-light-high mb-2"><i class="fas fa-envelope-open-text me-2 text-gold-faded"></i> Cover Letter:</h6>
            <p class="small text-muted-light application-text">{{ app.coverLetter }}</p>

            <!-- CONTACT SECTION (Dynamically displayed based on status) -->
            <div 
              class="p-4 rounded contact-section"
              :class="{ 
                'bg-dark-primary border border-gold-subtle': app.status === 'pending',
                'bg-success-dark-contact text-light-high': app.status === 'contacting' 
              }"
            >
              <h6 class="fw-bolder mb-2">
                <i :class="app.status === 'contacting' ? 'fas fa-phone-alt' : 'fas fa-shield-alt'" class="me-2 text-gold-faded"></i>
                Contact Details (Client View)
              </h6>
              
              <div v-if="app.status === 'contacting'">
                <p class="mb-1 fw-bold"><i class="fas fa-envelope me-2 text-gold"></i>Email: {{ app.freelancerId?.email || 'N/A' }}</p>
                <p class="mb-0 fw-bold"><i class="fas fa-phone me-2 text-gold"></i>Phone: {{ app.freelancerId?.phone || 'N/A' }}</p>
              </div>
              
              <div v-else>
                <p class="mb-0 small text-muted-light">
                  <i class="fas fa-lock me-2"></i> Contact information is securely hidden. Click **Unlock Contact** to proceed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import applicationService from '@/services/applicationService';
import jobService from '@/services/jobService';
import Swal from 'sweetalert2';

export default {
    // Component local state
    data() {
        return {
            applications: [],
            jobTitle: '',
            isJobClosed: false,
            isLoading: false,
            isUnlocking: false,
            jobId: null,
            user: null
        }
    },
    
    // Lifecycle Hook
    created() {
        this.jobId = this.$route.params.jobId;
        this.checkUserRole();
        if (this.jobId) {
            this.fetchData();
        }
    },
    
    // Component Methods
    methods: {
        checkUserRole() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                this.user = JSON.parse(userStr);
                if (this.user.role !== 'client') {
                    Swal.fire('Access Denied', 'Only Clients (Job Owners) can view this page.', 'error');
                    this.$router.push('/');
                }
            } else {
                this.$router.push('/login');
            }
        },
        
        async fetchData() {
            this.isLoading = true;
            try {
                const jobRes = await jobService.getJobById(this.jobId);
                this.jobTitle = jobRes.data.title;
                this.isJobClosed = jobRes.data.status === 'closed';

                const appRes = await applicationService.getJobApplications(this.jobId);
                this.applications = appRes.data;

            } catch (error) {
                console.error("Error fetching data:", error);
                const msg = error.response?.data?.msg || 'Failed to load job details or applications.';
                Swal.fire('Error', msg, 'error');
            } finally {
                this.isLoading = false;
            }
        },

        async unlockContact(applicationId) {
            this.isUnlocking = true;
            const appIndex = this.applications.findIndex(app => app._id === applicationId);

            const result = await Swal.fire({
                title: 'Confirm Unlock Contact?',
                text: "By unlocking contact, you accept this application, and the freelancer's contact details will be revealed. This action cannot be undone.",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#FFD700',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Unlock it!'
            });

            if (!result.isConfirmed) {
                this.isUnlocking = false;
                return;
            }

            try {
                await applicationService.unlockContact(applicationId);
                
                if (appIndex !== -1) {
                    this.applications[appIndex].status = 'contacting';
                    this.applications = [...this.applications]; 
                }

                Swal.fire('Unlocked!', 'Freelancer contact details are now visible. You can proceed to hire.', 'success');

            } catch (error) {
                console.error("Unlock Error:", error);
                const msg = error.response?.data?.msg || 'Failed to unlock contact.';
                Swal.fire('Error', msg, 'error');
            } finally {
                this.isUnlocking = false;
            }
        },

        async markAsHiredAndClose(freelancerId) {
            this.isUnlocking = true;
            
            if (!this.jobId || !freelancerId) {
                Swal.fire('Data Error', 'Job ID or Freelancer ID is missing. Cannot proceed with hiring.', 'error');
                this.isUnlocking = false;
                return;
            }
            
            const result = await Swal.fire({
                title: 'Mark as Hired and Close Job?',
                text: "This action will close the job, award the freelancer 1 reputation point, and reject all other applications. Are you sure?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Mark as Hired'
            });

            if (!result.isConfirmed) {
                this.isUnlocking = false;
                return;
            }

            try {
                const res = await jobService.closeJob(this.jobId, freelancerId); 
                
                this.isJobClosed = true;
                this.fetchData();

                Swal.fire({
                    title: 'Success!',
                    html: `Job closed. **${res.data.freelancerReputation || 1} Reputation Point(s)** awarded!`,
                    icon: 'success'
                });

            } catch (error) {
                console.error("Close Job Error:", error);
                const msg = error.response?.data?.msg || 'Failed to close job.';
                Swal.fire('Error', msg, 'error');
            } finally {
                this.isUnlocking = false;
            }
        }
    }
}
</script>

<style scoped>
/* -------------------------------------------
 * CUSTOM LUXURY COLORS
 * ------------------------------------------- */
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4)); }
.text-gold { color: var(--color-accent-gold) !important; }
.text-gold-faded { color: rgba(255, 215, 0, 0.6); }
.text-muted-light { color: #bdbdbd; }
.text-light-high { color: #f0f0f0; } 
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.bg-dark-skill { background-color: #333333 !important; }
.border-gold-subtle { border-color: rgba(255, 215, 0, 0.1) !important; }
.luxury-divider { border-color: #444 !important; }

/* Status Badges */
.bg-success-dark { background-color: #28a745 !important; color: #fff !important; }
.bg-secondary-dark { background-color: #6c757d !important; color: #fff !important; }
.bg-warning-dark { background-color: #ffc107 !important; color: #1A1A1A !important; }

/* Budget Highlight */
.text-success-gold { 
    color: #4CAF50 !important; 
    filter: drop-shadow(0 0 3px rgba(76, 175, 80, 0.5));
}
.pro-indicator {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
}

/* -------------------------------------------
 * CARD STYLING
 * ------------------------------------------- */
.luxury-card-enhanced {
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
}
.application-card:hover {
    border-color: var(--color-accent-gold);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

/* Header Text */
.page-title-apps {
    font-size: 1.75rem;
}
.status-indicator-badge {
    padding: 0.5em 1em;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
}
.freelancer-name {
    font-size: 1.25rem;
}
.skill-badge-app {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    font-weight: 500;
}


/* -------------------------------------------
 * CONTACT SECTION & STATUS
 * ------------------------------------------- */
/* Contact Section Backgrounds */
.bg-success-dark-contact {
    background-color: #2e604f !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
}
.bg-success-dark-glow {
    background-color: #4CAF50 !important;
    filter: drop-shadow(0 0 5px rgba(76, 175, 80, 0.5));
}
.bg-danger-dark {
    background-color: #dc3545 !important;
}

/* Contact text styling */
.contact-section p {
    color: var(--color-text-light);
}


/* -------------------------------------------
 * BUTTON STYLING
 * ------------------------------------------- */
/* Unlock Button (Gold) */
.unlock-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 700;
}

/* Mark as Hired Button (Dark Outline Danger) */
.btn-outline-danger-dark {
    color: #dc3545 !important;
    border: 2px solid #dc3545 !important;
    background-color: transparent !important;
    font-weight: 700;
    transition: all 0.2s;
}
.btn-outline-danger-dark:hover {
    background-color: #dc3545 !important;
    color: #fff !important;
}

/* Back Button (Gold Outline) */
.btn-outline-gold {
    color: var(--color-accent-gold) !important;
    border-color: var(--color-accent-gold) !important;
}
.btn-outline-gold:hover {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>