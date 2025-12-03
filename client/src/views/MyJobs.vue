<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h1 class="fw-bolder text-gold-highlight">
        <i class="fas fa-clipboard-list me-3"></i> Client Job Dashboard
      </h1>
      <router-link to="/post-job" class="btn btn-gold fw-bold rounded-pill px-4 shadow-lg text-uppercase">
        <i class="fas fa-plus me-2"></i> Post New Job
      </router-link>
    </div>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-gold" role="status" style="width: 3.5rem; height: 3.5rem;"></div>
      <p class="text-muted-light mt-3 fs-5">Retrieving your posted opportunities...</p>
    </div>

    <!-- NO DATA STATE -->
    <div v-else-if="myJobs.length === 0" class="text-center py-5 card luxury-card-enhanced">
      <i class="fas fa-bullhorn text-gold mb-3" style="font-size: 4rem;"></i>
      <h5 class="mt-3 text-light-high">No Active Job Postings</h5>
      <p class="text-muted-light">You haven't posted any jobs yet. Click 'Post New Job' to start hiring elite talent!</p>
    </div>

    <!-- JOB LISTING -->
    <div v-else class="row g-4">
      <div class="col-md-6" v-for="job in myJobs" :key="job._id">
        
        <div 
          class="card h-100 shadow-xl luxury-card-enhanced job-card-client" 
          :class="{'pro-highlight-job': job.isPremium}"
        >
          <div class="card-body p-4">
            
            <!-- TITLE & BADGES -->
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="card-title fw-bolder text-truncate me-2 text-light-high job-title-client">{{ job.title }}</h5>
              <div class="text-end flex-shrink-0">
                
                <!-- PREMIUM BADGE -->
                <span v-if="job.isPremium" class="badge bg-gold-accent text-dark fw-bold me-1 px-3 py-2 rounded-pill premium-tag-details">
                    <i class="fas fa-crown me-1"></i>PREMIUM
                </span>
                
                <!-- STATUS BADGE -->
                <span 
                  class="badge text-uppercase fw-bold status-badge"
                  :class="{ 
                    'bg-success-dark': job.status === 'open', 
                    'bg-secondary-dark': job.status === 'closed' 
                  }"
                >
                  {{ job.status }}
                </span>
              </div>
            </div>
            
            <!-- BUDGET & APPLICATIONS COUNT -->
            <div class="d-flex justify-content-between align-items-center small mb-3 border-bottom border-luxury-separator pb-3">
              <p class="text-muted-light mb-0">
                  Budget: <span class="fw-bold text-success-gold fs-6">${{ job.budget }}</span>
              </p>
              <router-link :to="`/jobs/${job._id}/applications`" class="text-gold fw-bold hover-gold small">
                  <i class="fas fa-users me-1"></i> View Applications ({{ job.applicationCount || 0 }})
              </router-link>
            </div>
            
            <!-- DESCRIPTION -->
            <p class="card-text text-truncate-3 text-muted-light">
                {{ job.description }}
            </p>
          </div>
          
          <!-- FOOTER: ACTIONS -->
          <div class="card-footer bg-dark-primary d-flex justify-content-end align-items-center py-3 border-top-luxury">
            <div class="d-flex align-items-center">
                
                <!-- PROMOTE BUTTON (Conditional Text) -->
                <button 
                  v-if="job.status === 'open' && !job.isPremium"
                  class="btn btn-sm btn-gold text-dark fw-bold me-2 px-3 promote-btn" 
                  @click="promoteToPremium(job._id)"
                  :disabled="isPromoting"
                >
                  <span v-if="isPromoting" class="spinner-border spinner-border-sm me-1"></span>
                  <i class="fas fa-arrow-up me-1"></i> {{ userIsPro ? 'Promote (Free)' : 'Promote ($5)' }}
                </button>

                <!-- CLOSE JOB BUTTON -->
                <button 
                  v-if="job.status === 'open'"
                  class="btn btn-sm btn-outline-danger-dark fw-bold px-3" 
                  @click="closeJob(job._id)" 
                >
                  <i class="fas fa-times me-1"></i> Close Job
                </button>
                
                <span v-else class="text-muted-light small ms-2"><i class="fas fa-check-circle me-1"></i> Job Archived</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import jobService from '@/services/jobService'; 
import api from '@/services/api';

export default {
    // Component local state
    data() {
        return {
            myJobs: [],
            isLoading: false,
            isPromoting: false, 
            userId: null,
            userIsPro: false, 
        }
    },
    
    // Lifecycle Hook
    created() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.userId = user.id; 
            this.userIsPro = user.isPro; 
            
            if (user.role === 'client') {
                this.fetchMyJobs();
            } else {
                Swal.fire('Unauthorized', 'You must be logged in as a Client to access this page.', 'error');
                this.$router.push('/');
            }
        } else {
            this.$router.push('/login'); 
        }
        this.handlePaymentStatus();
    },
    
    // Component Methods
    methods: {
        handlePaymentStatus() {
            const params = new URLSearchParams(window.location.search);
            const status = params.get('payment');

            if (status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Promotion Successful!',
                    text: 'Your job has been marked as Premium.',
                    confirmButtonText: 'OK',
                    customClass: { confirmButton: 'btn-gold-swal' }
                }).then(() => {
                    this.fetchMyJobs(); 
                    this.$router.replace({ query: {} }); 
                });
                
            } else if (status === 'cancelled') {
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Cancelled',
                    text: 'Job promotion was cancelled.',
                    confirmButtonText: 'OK',
                    customClass: { confirmButton: 'btn-gold-swal' }
                }).then(() => {
                    this.$router.replace({ query: {} });
                });
            }
        },

        async fetchMyJobs() {
            if (!this.userId) return;
            this.isLoading = true;
            try {
                const res = await jobService.getMyJobs(); 
                this.myJobs = res.data; 
            } catch (error) {
                console.error("Error fetching client jobs:", error);
                Swal.fire('Error', 'Failed to load your jobs.', 'error');
            } finally {
                this.isLoading = false;
            }
        },
        
        async promoteToPremium(jobId) {
            this.isPromoting = true;

            const confirmText = this.userIsPro 
                ? "As a PRO member, this promotion is FREE." 
                : "This job will receive top-of-list visibility (Cost: $5).";
            
            const confirmBtnText = this.userIsPro ? 'Promote Now' : 'Pay $5 & Promote';

            const result = await Swal.fire({
                title: 'Promote to Premium Job?',
                text: confirmText,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#FFD700', 
                confirmButtonText: confirmBtnText,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        // Call API (Logic handled in backend based on PRO status)
                        const res = await api.post(`/payment/upgrade-job/${jobId}`);
                        return res.data;
                    } catch (err) {
                        Swal.showValidationMessage(`Request Failed: ${err.response?.data?.msg || 'Server error'}`);
                        this.isPromoting = false;
                        return false;
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            });

            if (result.isConfirmed) {
                if (result.value.success) {
                    // PRO User: Immediate success
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: result.value.msg || 'Job promoted successfully!',
                        confirmButtonText: 'OK',
                        customClass: { confirmButton: 'btn-gold-swal' }
                    });
                    this.fetchMyJobs();
                } else if (result.value.url) {
                    // Regular User: Redirect to Stripe
                    window.location.href = result.value.url;
                }
            }
            
            this.isPromoting = false;
        },
        
        async closeJob(id) {
            const result = await Swal.fire({
                title: 'Confirm Job Closure',
                text: "The job will be marked as 'Closed'.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Close Job'
            });

            if (result.isConfirmed) {
                this.isLoading = true;
                try {
                    await jobService.closeJobOnly(id); 
                    Swal.fire('Success!', 'Your job listing has been closed.', 'success');
                    this.fetchMyJobs(); 
                } catch (error) {
                    Swal.fire('Error', error.response?.data?.msg || 'Failed to close job.', 'error');
                } finally {
                    this.isLoading = false;
                }
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
.text-muted-light { color: #bdbdbd; }
.text-light-high { color: #f0f0f0; } 
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.text-gold { color: var(--color-accent-gold) !important; }

/* Status Badges */
.bg-success-dark { background-color: #28a745 !important; color: #fff !important; }
.bg-secondary-dark { background-color: #6c757d !important; color: #fff !important; }

/* Budget Highlight */
.text-success-gold { 
    color: #4CAF50 !important; 
    filter: drop-shadow(0 0 3px rgba(76, 175, 80, 0.5));
}

/* -------------------------------------------
 * CARD STYLING
 * ------------------------------------------- */
.luxury-card-enhanced {
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
    transition: all 0.3s ease;
}
.job-card-client:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
}

/* PREMIUM HIGHLIGHT for the whole card */
.pro-highlight-job {
    border: 2px solid var(--color-accent-gold);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3) !important;
}

/* Card Header/Footer Separation */
.border-top-luxury { border-top: 1px solid #444 !important; }
.border-luxury-separator { border-color: #333 !important; }

/* Title Styling */
.job-title-client {
    font-size: 1.4rem;
}

/* Text Truncation */
.text-truncate-3 {
    overflow: hidden;
    display: -webkit-box; 
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.6;
}

/* PREMIUM BADGE (Using the optimized style from JobDetails) */
.premium-tag-details {
    letter-spacing: 0.08em;
    font-size: 0.75rem;
    font-weight: 700 !important;
    text-transform: uppercase;
    border-radius: 50rem !important;
    color: #1A1A1A !important;
}

/* -------------------------------------------
 * BUTTON STYLING
 * ------------------------------------------- */
/* Promote Button (Gold) */
.promote-btn {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-weight: 700;
}

/* Close Button (Danger Outline Dark) */
.btn-outline-danger-dark {
    color: #dc3545 !important;
    border-color: #dc3545 !important;
    background-color: transparent !important;
    font-weight: 700;
    transition: all 0.2s;
}
.btn-outline-danger-dark:hover {
    background-color: #dc3545 !important;
    color: #fff !important;
}

/* View Applications Link Hover */
.hover-gold:hover {
    color: var(--color-accent-gold) !important;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

/* SweetAlert button styling */
.btn-gold-swal {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>