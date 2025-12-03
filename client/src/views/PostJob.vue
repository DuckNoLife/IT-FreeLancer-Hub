<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-9 col-lg-8">
        
        <!-- HEADER -->
        <h1 class="fw-bolder text-gold-highlight text-center mb-5">
          <i class="fas fa-plus-circle me-3"></i> Post New Elite Opportunity
        </h1>
        
        <!-- Form Card -->
        <div class="card luxury-form-card shadow-3xl">
          <div class="card-header bg-dark-primary border-bottom-luxury pt-4 px-4">
            <h4 class="fw-bold text-gold-highlight mb-0"><i class="fas fa-file-invoice me-2"></i> Project Details</h4>
          </div>
          <div class="card-body p-4 p-sm-5">
            <form @submit.prevent="createJob">
              
              <!-- Job Title -->
              <div class="mb-3">
                <label class="form-label fw-bold text-muted-light">Job Title</label>
                <input type="text" class="form-control luxury-input" v-model="form.title" required placeholder="e.g. Build a React E-commerce Site">
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label fw-bold text-muted-light">Detailed Description</label>
                <textarea class="form-control luxury-input" v-model="form.description" rows="6" required placeholder="Describe the project scope, required deliverables, and estimated timeline..."></textarea>
              </div>

              <div class="row">
                <!-- Budget -->
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold text-muted-light">Budget (USD)</label>
                  <div class="input-group luxury-input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" v-model="form.budget" required min="1" placeholder="Minimum $1">
                  </div>
                </div>

                <!-- Required Skills -->
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-bold text-muted-light">Required Skills</label>
                  <input type="text" class="form-control luxury-input" v-model="skillsInput" placeholder="React, Node.js, MongoDB (comma separated)">
                  <small class="form-text text-muted-light mt-1">Separate technical skills with commas.</small>
                </div>
              </div>

              <!-- Premium Checkbox (LOGIC UPDATED: Always Enabled) -->
              <div class="mb-4 form-check luxury-premium-check p-3 rounded border" :class="{ 'border-gold-glow': form.isPremium }">
                <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="premiumCheck" 
                    v-model="form.isPremium"
                >
                <label class="form-check-label fw-bold text-gold-highlight ms-2" for="premiumCheck">
                  <i class="fas fa-crown me-1"></i> Promote as Premium Job
                </label>
                
                <!-- Dynamic Helper Text -->
                <div v-if="userIsPro" class="small text-success-gold mt-1 ms-4 ps-2 fw-bold">
                  <i class="fas fa-check-circle me-1"></i> Free benefit for PRO Members.
                </div>
                <div v-else class="small text-muted-light mt-1 ms-4 ps-2">
                  <i class="fas fa-tag me-1"></i> Cost: <strong>$5.00</strong> (One-time fee). You will be redirected to payment after posting.
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-gold py-3 fw-bold shadow-lg text-uppercase" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ submitButtonText }}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jobService from '@/services/jobService'; 
import api from '@/services/api'; // Import trực tiếp api để gọi endpoint thanh toán
import Swal from 'sweetalert2';

export default {
    // Component local state
    data() {
        return {
            form: {
                title: '',
                description: '',
                budget: null,
                isPremium: false
            },
            skillsInput: '',
            isLoading: false,
            userIsPro: false
        }
    },
    
    // Computed property for dynamic button text
    computed: {
        submitButtonText() {
            if (this.isLoading) return 'Processing...';
            // Logic: Nếu chọn Premium VÀ không phải PRO -> Nút hiện "Post & Pay $5"
            if (this.form.isPremium && !this.userIsPro) return 'Post Job & Pay $5';
            return 'Post Job Now';
        }
    },
    
    // Lifecycle Hook
    created() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.userIsPro = user.isPro || false;
        }
    },
    
    // Component methods
    methods: {
        async createJob() {
            // Validation
            if (!this.form.title || !this.form.description || !this.form.budget) {
                Swal.fire('Validation Error', 'Please fill in all required fields.', 'warning');
                return;
            }
            if (this.form.budget < 1) {
                Swal.fire('Validation Error', 'Budget must be at least $1.', 'warning');
                return;
            }

            this.isLoading = true;
            try {
                const skillsArray = this.skillsInput.split(',').map(s => s.trim()).filter(s => s);

                const payload = {
                    ...this.form,
                    requiredSkills: skillsArray
                };

                // 1. Create the Job (Backend will force isPremium=false for non-PRO users initially)
                const res = await jobService.createJob(payload);
                const newJob = res.data;

                // 2. Logic: Payment Redirect for Non-PRO users choosing Premium
                if (this.form.isPremium && !this.userIsPro) {
                    
                    Swal.fire({
                        title: 'Job Created!',
                        text: 'Redirecting to secure payment for Premium promotion...',
                        icon: 'info',
                        showConfirmButton: false,
                        timer: 3000,
                        allowOutsideClick: false
                    });

                    // Call Payment API to get Stripe URL
                    const payRes = await api.post(`/payment/upgrade-job/${newJob._id}`);
                    
                    if (payRes.data.url) {
                        // Redirect to Stripe Sandbox
                        window.location.href = payRes.data.url;
                    } else {
                        throw new Error("Payment URL missing");
                    }

                } else {
                    // Standard Success Flow (PRO user or Standard Job)
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Your opportunity is live.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    this.$router.push('/my-jobs');
                }

            } catch (error) {
                console.error('Job Posting Error:', error);
                const msg = error.response?.data?.msg || 'An error occurred. Please try again.';
                Swal.fire('Error', msg, 'error');
            } finally {
                // Prevent loading spinner stop if redirecting (avoids UI flash)
                if (!(this.form.isPremium && !this.userIsPro)) {
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
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.border-bottom-luxury { border-bottom: 1px solid #444 !important; }
.text-success-gold { color: #4CAF50 !important; }

/* -------------------------------------------
 * LUXURY FORM CARD
 * ------------------------------------------- */
.luxury-form-card {
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

/* Input Styles */
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
.luxury-input-group .input-group-text {
    background-color: var(--color-dark-primary) !important;
    border-color: #444 !important;
    color: var(--color-text-light) !important;
    border-radius: 0.5rem 0 0 0.5rem;
}

/* -------------------------------------------
 * PREMIUM CHECKBOX STYLING
 * ------------------------------------------- */
.luxury-premium-check {
    background-color: #1A1A1A !important; 
    border: 1px solid #444; /* Default border */
    padding-left: 2rem !important;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
    transition: border-color 0.3s ease;
}

/* Highlight border when checked */
.border-gold-glow {
    border-color: var(--color-accent-gold) !important;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.15);
}

.luxury-premium-check .form-check-input {
    background-color: #333;
    border-color: var(--color-accent-gold);
    cursor: pointer;
}
.luxury-premium-check .form-check-input:checked {
    background-color: var(--color-accent-gold);
    border-color: var(--color-accent-gold);
    box-shadow: none;
}
</style>