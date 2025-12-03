<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-5">
        
        <!-- Form Card (Luxury Style) -->
        <div class="card luxury-form-card shadow-3xl mt-4">
          <div class="card-body p-4 p-sm-5">
            
            <div class="text-center mb-5">
                <i class="fas fa-lock-open text-gold-highlight mb-3" style="font-size: 2.5rem;"></i>
                <h2 class="card-title fw-bolder mb-0 text-gold-highlight text-uppercase">Reset Credentials</h2>
                <p class="text-muted-light mt-2 small">
                  Enter your email address to receive a secure link to reset your password.
                </p>
            </div>
            
            <form @submit.prevent="handleForgotPassword">
              <div class="mb-4">
                <label class="form-label text-muted-light fw-medium">Email Address</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0">
                    <i class="fas fa-envelope text-gold-faded"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control border-start-0 ps-0" 
                    v-model="email" 
                    required 
                    placeholder="name@example.com"
                  >
                </div>
              </div>

              <!-- Primary Action Button (Gold) -->
              <button class="btn btn-gold w-100 py-3 fw-bold shadow-lg text-uppercase" type="submit" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'SENDING LINK...' : 'SEND RESET LINK' }}
              </button>
              
              <!-- Back to Login Link -->
              <div class="text-center mt-4">
                <router-link to="/login" class="text-decoration-none small text-muted-light hover-gold">
                    <i class="fas fa-arrow-left me-1"></i> Back to Login
                </router-link>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import Swal from 'sweetalert2';

// View component for password recovery initiation
export default {
    // Component state
    data() {
        return {
            email: '',
            isLoading: false,
        }
    },
    
    // Component methods
    methods: {
        async handleForgotPassword() {
            this.isLoading = true;
            try {
                // API Endpoint: POST /api/auth/forgotpassword
                await api.post('/auth/forgotpassword', {
                    email: this.email
                });

                // Success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Request Sent',
                    text: 'If your email is registered, please check your inbox for the password reset link.',
                    confirmButtonText: 'OK',
                    customClass: { confirmButton: 'btn-gold-swal' }
                });
                
                // Redirect after submission
                this.$router.push('/login'); 

            } catch (error) {
                console.error('Password Reset Error:', error);
                // Error notification (generic message for security)
                Swal.fire({
                    icon: 'error',
                    title: 'Request Failed',
                    text: 'There was an issue processing your request. Please try again later.'
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
/* Custom Colors/Variables */
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4)); }
.text-gold-faded { color: rgba(255, 215, 0, 0.6); }
.text-muted-light { color: #bdbdbd; }
.hover-gold:hover { color: var(--color-accent-gold) !important; }

/* -------------------------------------------
 * LUXURY FORM CARD
 * ------------------------------------------- */
.luxury-form-card {
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

/* Input Group Styling */
.luxury-input-group .input-group-text {
    background-color: var(--color-dark-primary) !important;
    border-color: #444 !important;
    border-radius: 0.3rem 0 0 0.3rem;
}

.luxury-input-group .form-control {
    background-color: var(--color-dark-primary) !important;
    border-color: #444 !important;
    color: var(--color-text-light) !important;
}

/* Ensure Swal buttons use the gold theme */
.btn-gold-swal {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>