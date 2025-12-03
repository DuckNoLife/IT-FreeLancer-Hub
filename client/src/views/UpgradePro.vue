<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-8">
        
        <!-- HEADER -->
        <h1 class="fw-bolder text-gold-highlight text-center mb-4">
          <i class="fas fa-crown me-3"></i> Elite Membership Plans
        </h1>
        <p class="text-center text-muted-light lead mb-5">
          Unlock exclusive features, priority visibility, and dedicated support for top-tier professionals.
        </p>

        <!-- PRICING CARDS -->
        <div class="row g-4 justify-content-center">
          
          <!-- PLAN 1: BASIC (Default) -->
          <div class="col-md-5">
            <div class="card h-100 luxury-card-enhanced shadow-md border-luxury-separator">
              <div class="card-body p-5 text-center">
                <h4 class="fw-bold text-muted-light mb-4">BASIC (Current)</h4>
                <div class="my-4">
                  <span class="display-4 fw-bolder text-muted-light">$0</span>
                  <p class="small text-muted-light">/ Lifetime</p>
                </div>
                <hr class="luxury-divider">
                <ul class="list-unstyled text-start small mt-4 pricing-list">
                  <li class="mb-3 text-light-high"><i class="fas fa-check text-success-pro me-3"></i> Free forever & Immediate Access</li>
                  <li class="mb-3 text-light-high"><i class="fas fa-check text-success-pro me-3"></i> Post 1 open job (Client)</li>
                  <li class="mb-3 text-light-high"><i class="fas fa-check text-success-pro me-3"></i> Unlimited job applications (Freelancer)</li>
                  <li class="mb-3 text-muted-light"><i class="fas fa-times text-danger-muted me-3"></i> Cannot promote jobs to Premium</li>
                  <li class="mb-3 text-muted-light"><i class="fas fa-times text-danger-muted me-3"></i> Standard visibility & search ranking</li>
                </ul>
                <button class="btn btn-outline-secondary w-100 mt-3 luxury-current-btn" disabled>
                    <i class="fas fa-lock-open me-2"></i> Your Current Plan
                </button>
              </div>
            </div>
          </div>

          <!-- PLAN 2: PRO MEMBER (Highlighted) -->
          <div class="col-md-5">
            <div class="card h-100 luxury-card-enhanced pro-highlight shadow-2xl">
              <div class="card-body p-5 text-center">
                <span class="badge bg-gold-accent text-dark fw-bold mb-2 px-3 py-2 rounded-pill premium-tag-details">
                    <i class="fas fa-star me-1"></i> BEST VALUE
                </span>
                <h4 class="fw-bold text-gold mb-4">PRO Member</h4>
                <div class="my-4">
                  <span class="display-4 fw-bolder text-gold">${{ price }}</span>
                  <p class="small text-muted-light">/ Lifetime (One-time fee)</p>
                </div>
                <hr class="luxury-divider">
                <ul class="list-unstyled text-start small mt-4 pricing-list">
                  <li class="mb-3 text-gold fw-bold"><i class="fas fa-trophy text-gold me-3"></i> **Everything in Basic**</li>
                  <li class="mb-3 text-light-high fw-bold"><i class="fas fa-check text-success-pro me-3"></i> Post 3 simultaneous jobs (Client)</li>
                  <li class="mb-3 text-light-high fw-bold"><i class="fas fa-check text-success-pro me-3"></i> Ability to promote jobs to Premium</li>
                  <li class="mb-3 text-light-high fw-bold"><i class="fas fa-check text-success-pro me-3"></i> Priority visibility in searches</li>
                  <li class="mb-3 text-light-high fw-bold"><i class="fas fa-check text-success-pro me-3"></i> Official PRO Badge on profile</li>
                </ul>
                
                <button 
                  class="btn btn-gold w-100 py-2 mt-3 fw-bold text-uppercase shadow-lg" 
                  @click="handleUpgrade"
                  :disabled="isPro || isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isPro ? 'You are Already PRO' : `Upgrade Now for $${price}` }}
                </button>
                <small v-if="!isPro" class="text-muted-light d-block mt-3">Secure, one-time payment processing via Stripe.</small>
              </div>
            </div>
          </div>
        </div>

        <!-- CALL TO ACTION / INFORMATION ALERT -->
        <div class="luxury-alert-promo text-center mt-5">
            <h5 class="fw-bold mb-1 text-gold"><i class="fas fa-star me-2"></i> Premium Job Promotion</h5>
            <p class="mb-0 small text-light-high">
                The **Premium Job promotion** feature (for individual listings) is exclusively available to 
                **PRO Members**. Upgrade your membership first to unlock this capability.
            </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'; 
import Swal from 'sweetalert2';

export default {
    // Component local state
    data() {
        return {
            price: 20, // PRO package price (USD)
            isPro: false,
            isLoading: false
        }
    },
    
    // Lifecycle Hooks
    created() {
        this.checkProStatus();
        // Handler for payment status redirect (e.g., from Stripe)
        this.handlePaymentStatus();
    },
    
    // Component Methods
    methods: {
        // Checks the PRO status from local storage to update the component state.
        checkProStatus() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                this.isPro = user.isPro || false; 
            }
        },
        
        // Checks URL query parameters for payment status indicators (success/cancelled) 
        handlePaymentStatus() {
            const params = new URLSearchParams(window.location.search);
            const status = params.get('payment');

            if (status === 'success') {
                // Success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    text: 'Your PRO status will be updated shortly. Please check your profile in a moment.',
                    confirmButtonText: 'Check Profile Now',
                    customClass: { confirmButton: 'btn-gold-swal' }
                }).then(() => {
                    // Clear query param after processing
                    this.$router.replace({ query: {} });
                });
                
            } else if (status === 'cancelled') {
                // Cancellation notification
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Cancelled',
                    text: 'Your upgrade to PRO was cancelled. You have not been charged.',
                    confirmButtonText: 'OK',
                    customClass: { confirmButton: 'btn-gold-swal' }
                }).then(() => {
                    this.$router.replace({ query: {} });
                });
            }
        },
        
        // Initiates the payment process by calling the backend API to create a payment session (e.g., Stripe Checkout).
        async handleUpgrade() {
            if (this.isPro) return; 
            
            this.isLoading = true; 

            try {
                // API Endpoint: POST /api/payment/upgrade-account
                const res = await api.post('/payment/upgrade-account');
                
                if (res.data.url) {
                    // Redirect to the external payment gateway
                    window.location.href = res.data.url;
                } else {
                    throw new Error('Missing Stripe checkout URL.');
                }

            } catch (error) {
                console.error('Payment Initialization Error:', error);
                const msg = error.response?.data?.msg || 'Failed to create payment session. Please try again later.';
                Swal.fire('Error', msg, 'error');
                this.isLoading = false; 
            }
        },
    }
}
</script>

<style scoped>
/* Custom Colors/Variables */
.text-gold { color: var(--color-accent-gold) !important; }
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4)); }
.text-muted-light { color: #bdbdbd; }
.text-light-high { color: #f0f0f0; } 
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.bg-gold-accent { background-color: var(--color-accent-gold) !important; }
.luxury-divider { border-top: 1px solid #444 !important; }

/* Custom success/danger colors integrated into the dark theme */
.text-success-pro { color: #4CAF50 !important; }
.text-danger-muted { color: #C64949 !important; } 

/* -------------------------------------------
 * LUXURY PRICING CARDS
 * ------------------------------------------- */
.luxury-card-enhanced {
    /* Base Card background: Deep Slate Gray */
    background-color: #1F1F1F !important; 
    border: 1px solid #333;
    border-radius: 1rem;
    transition: all 0.3s ease;
}

.pro-highlight {
    /* Highlighted Card: Gold Border and Shadow */
    border: 3px solid var(--color-accent-gold) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 215, 0, 0.5) !important;
}

.premium-tag-details {
    letter-spacing: 0.1em;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 50rem !important;
}

/* List Item Styling */
.pricing-list li {
    font-size: 0.95rem;
}
.pricing-list i {
    font-size: 1.1rem;
}

/* Button for current plan (muted) */
.luxury-current-btn {
    background-color: #333 !important;
    color: #999 !important;
    border-color: #444 !important;
    font-weight: 600;
}


/* -------------------------------------------
 * PROMO ALERT BOX
 * ------------------------------------------- */
.luxury-alert-promo {
    /* Dark Box with Gold Border */
    background-color: #1A1A1A; 
    border: 2px solid var(--color-accent-gold);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

/* SweetAlert button styling */
.btn-gold-swal {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>