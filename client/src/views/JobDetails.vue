<template>
  <div class="container py-5">
    
    <!-- LOADING STATE -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-gold" role="status" style="width: 3.5rem; height: 3.5rem;"></div>
      <p class="mt-3 fs-5 text-gold">Retrieving job specification...</p>
    </div>

    <!-- JOB CONTENT DISPLAY -->
    <div v-else-if="job" class="row g-4">
      
      <!-- COLUMN LEFT: Job Description and Application Form -->
      <div class="col-md-8">
        <div class="card luxury-card-enhanced mb-4">
          <div class="card-body p-5">
            
            <!-- Job Header -->
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h1 class="fw-bold text-gold display-6 job-title-glow">{{ job.title }}</h1>
              
              <!-- Premium Badge: FIXED contrast and style -->
              <span v-if="job.isPremium" class="badge bg-gold-accent text-royal-gold-text fw-bolder px-3 py-2 rounded-pill shadow-sm premium-tag-details">
                <i class="fas fa-crown me-1"></i>PREMIUM LISTING
              </span>
            </div>
            
            <!-- Posting Metadata -->
            <div class="text-muted-light mt-2 small">
              <i class="far fa-calendar-alt me-2 text-gold-faded"></i> Posted on {{ formatDate(job.createdAt) }}
            </div>

            <hr class="luxury-divider mb-4">

            <!-- Description Section -->
            <h4 class="fw-bold text-light mb-3"><i class="fas fa-file-alt me-2 text-gold"></i> Project Scope</h4>
            <p class="project-description text-light-high">{{ job.description }}</p>

            <!-- Required Skills Section -->
            <h4 class="fw-bold mt-5 text-light mb-3"><i class="fas fa-tools me-2 text-gold"></i> Required Expertise</h4>
            <div class="skill-tags">
              <span v-for="(skill, index) in job.requiredSkills" :key="index" 
                    class="badge bg-dark-skill text-gold-faded me-2 mb-2 p-2 fw-medium border border-gold-subtle">
                <i class="fas fa-code me-1"></i> {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- APPLICATION FORM (Visible only to Freelancers) -->
        <div v-if="canApply" class="card luxury-card-form">
          <div class="card-body p-5">
            <h3 class="fw-bold mb-4 text-gold-highlight"><i class="fas fa-paper-plane me-3"></i> Submit Your Proposal</h3>
            
            <form @submit.prevent="handleApply">
              <div class="mb-4">
                <label class="form-label fw-bold text-light">Cover Letter / Rationale</label>
                <textarea 
                  class="form-control luxury-input" 
                  rows="5" 
                  v-model="coverLetter" 
                  required 
                  placeholder="Detail your relevant experience, proposed approach, and estimated timeline..."
                ></textarea>
              </div>
              <button class="btn btn-gold fw-bold px-5 py-2 text-uppercase shadow-lg" :disabled="isSubmitting">
                <i class="fas fa-check me-2"></i> 
                {{ isSubmitting ? 'Processing Submission...' : 'Send Application' }}
              </button>
            </form>
          </div>
        </div>

        <!-- NOTIFICATION STATES (Enhanced Dark Luxury Alerts) -->
        <div v-else-if="user && user.role === 'client'" class="alert luxury-alert-warning" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i> **Unauthorized Access:** As a Client, you are not permitted to submit applications.
        </div>
        
        <div v-else-if="!user" class="alert luxury-alert-info" role="alert">
          <i class="fas fa-lock me-2"></i> Authentication Required. Please 
          <router-link to="/login" class="fw-bold text-decoration-none text-light-high">Log In</router-link> 
          to access the application submission form.
        </div>
        
      </div>

      <!-- COLUMN RIGHT: Budget and Client Information -->
      <div class="col-md-4">
        
        <!-- Budget Card -->
        <div class="card luxury-card-enhanced mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold text-gold-highlight mb-3">
              <i class="fas fa-coins me-2"></i> Project Budget
            </h5>
            <div class="d-flex justify-content-between align-items-center">
                <span class="display-6 fw-bolder text-success-gold budget-display-large">${{ formatBudget(job.budget) }}</span>
                <span class="badge bg-dark-primary text-muted-light border border-gold-subtle p-2">FIXED PRICE</span>
            </div>
          </div>
        </div>

        <!-- Client Information Card -->
        <div class="card luxury-card-enhanced">
          <div class="card-header bg-dark-primary fw-bold border-bottom-luxury p-3 text-light">
            <i class="fas fa-user-tie me-2 text-gold"></i> Client Profile
          </div>
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
              <!-- Client Avatar Placeholder -->
              <div class="client-avatar-placeholder me-3">
                <i class="fas fa-user-tie fa-2x text-gold-faded"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold text-light-high">{{ job.ownerId?.username || 'N/A' }}</h6>
                <small class="text-muted-light">{{ job.ownerId?.email || 'Confidential' }}</small>
              </div>
            </div>
            
            <ul class="list-unstyled small text-muted-light-high mt-4">
              <li class="mb-2">
                <i class="fas fa-map-marker-alt me-2 text-gold-faded"></i> Location: Vietnam
              </li>
              <li class="mb-2">
                <i class="fas fa-check-circle me-2 text-gold-faded"></i> Status: Email Verified
              </li>
              <li v-if="job.ownerId?.isPro">
                <i class="fas fa-star text-gold me-2"></i> Membership: **PRO Client**
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- JOB NOT FOUND STATE -->
     <div v-else class="text-center py-5 card luxury-card-enhanced">
      <i class="fas fa-exclamation-circle text-danger mb-3" style="font-size: 4rem;"></i>
      <h5 class="mt-3 text-light">Job Listing Not Found</h5>
      <p class="text-muted-light">The requested job ID does not exist or has been archived.</p>
    </div>
  </div>
</template>

<script>
import jobService from '@/services/jobService';
import applicationService from '@/services/applicationService';
import Swal from 'sweetalert2'; 

export default {
    // Component local state
    data() {
        return {
            job: null,
            user: null,
            coverLetter: '',
            isLoading: false,
            isSubmitting: false
        }
    },
    
    // Computed Properties
    computed: {
        canApply() {
            return this.user && this.user.role === 'freelancer';
        }
    },
    
    // Lifecycle Hook: Component creation
    created() {
        // Fetch job details
        this.fetchJob();
        
        // Retrieve and parse user data
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                this.user = JSON.parse(userStr);
            } catch (e) {
                console.error("Error parsing user data from localStorage:", e);
            }
        }
    },
    
    // Component Methods
    methods: {
        async fetchJob() {
            this.isLoading = true;
            try {
                const id = this.$route.params.id; 
                const res = await jobService.getJobById(id);
                this.job = res.data;
            } catch (error) {
                console.error('API Error: Failed to fetch job details.', error);
                this.job = null;
            } finally {
                this.isLoading = false;
            }
        },
        
        async handleApply() {
            if (!this.coverLetter.trim()) {
                Swal.fire('Validation Error', 'Cover letter cannot be empty.', 'warning');
                return;
            }

            this.isSubmitting = true;
            try {
                await applicationService.applyForJob({
                    jobId: this.job._id,
                    coverLetter: this.coverLetter
                });

                // Success notification
                Swal.fire({
                    icon: 'success', 
                    title: 'Application Sent', 
                    text: 'Your proposal has been successfully submitted to the client.', 
                    confirmButtonColor: '#FFD700',
                    customClass: { confirmButton: 'btn-gold-swal' }
                });
                
                this.coverLetter = ''; // Clear form input

            } catch (error) {
                // Error handling
                const msg = error.response?.data?.msg || 'An unexpected error occurred during submission.';
                Swal.fire('Submission Failed', msg, 'error');
            } finally {
                this.isSubmitting = false;
            }
        },
        
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        },
        
        formatBudget(budget) {
            return new Intl.NumberFormat().format(budget);
        }
    }
}
</script>

<style scoped>
/* Custom local variables/classes for Dark Luxury Theme consistency */
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.text-gold { color: var(--color-accent-gold) !important; }
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.3)); }
.text-gold-faded { color: rgba(255, 215, 0, 0.7); }
.border-gold-subtle { border-color: rgba(255, 215, 0, 0.1) !important; }

/* NEW CUSTOM COLOR FOR ROYAL GOLD TEXT (BRIGHT WHITE FIX) */
.text-royal-gold-text { 
    color: #FFFFFF !important; /* FIXED: Bright White for maximum visibility/luxury contrast */
    /* Black shadow for definition, bright gold glow */
    text-shadow: 0 0 4px #000000, 0 0 8px rgba(255, 215, 0, 0.9); 
}

/* NEW/ADJUSTED COLORS FOR ENHANCED CONTRAST */
.text-light-high { color: #f0f0f0; } 
.text-muted-light { color: #bdbdbd; } 
.text-muted-light-high { color: #f0f0f0; } 
.bg-dark-skill { background-color: #333333 !important; }

/* Highlight color for the Budget amount */
.text-success-gold { 
    color: #4CAF50 !important; 
    filter: drop-shadow(0 0 5px rgba(76, 175, 80, 0.7)); 
}
.budget-display-large {
    letter-spacing: -0.05em;
}

/* -------------------------------------------
 * CARD STYLING & BACKGROUND FIX
 * ------------------------------------------- */
.luxury-card-enhanced {
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
}
.luxury-card-form {
    background-color: #1A1A1A !important; 
    border: 1px solid var(--color-accent-gold); 
    border-radius: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 215, 0, 0.2);
}

/* Job Title Glow */
.job-title-glow {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));
}
.premium-tag-details {
    letter-spacing: 0.08em;
    font-size: 0.8rem;
    /* Added box-shadow for a 3D effect on the badge */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.3);
}


/* Input/Textarea Styling */
.luxury-input {
    background-color: var(--color-dark-primary) !important;
    border-color: #444 !important;
    color: var(--color-text-light) !important;
    border-radius: 0.5rem;
}
.luxury-input:focus {
    box-shadow: 0 0 0 0.25rem rgba(255, 215, 0, 0.2) !important;
    border-color: var(--color-accent-gold) !important;
}

/* Divider Customization */
.luxury-divider {
    border-top: 1px solid #444;
}
.border-bottom-luxury {
    border-bottom: 1px solid #444 !important;
}

/* Alert Styling for Dark Theme Integration */
.luxury-alert-warning {
    border: 1px solid #FFD700;
    background-color: #333300; 
    color: #FFD700;
    border-radius: 0.5rem;
    padding: 1rem;
}
.luxury-alert-info {
    border: 1px solid #2980b9;
    background-color: #173f5f;
    color: #85c1e9;
    border-radius: 0.5rem;
    padding: 1rem;
}
.luxury-alert-info .text-light-high {
    color: #fff !important; 
    text-shadow: none;
    font-weight: 700;
}

/* Client Avatar Placeholder */
.client-avatar-placeholder {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-dark-primary);
    border-radius: 50%;
    border: 2px solid var(--color-accent-gold);
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

/* Project Description Formatting */
.project-description {
    white-space: pre-wrap;
    line-height: 1.75;
}

/* Skill Tags section styling */
.skill-tags .badge {
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    background-color: #333333 !important;
    border: 1px solid #444;
}
/* SweetAlert button styling */
.btn-gold-swal {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>