<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-5">
        
        <!-- Form Card (Luxury Style) -->
        <div class="card luxury-form-card shadow-3xl mt-4">
          <div class="card-body p-4 p-sm-5">
            
            <div class="text-center mb-5">
                <i class="fas fa-redo-alt text-gold-highlight mb-3" style="font-size: 2.5rem;"></i>
                <h2 class="card-title fw-bolder mb-0 text-gold-highlight text-uppercase">Reset Your Password</h2>
                <p class="text-muted-light mt-1 small">Please set a new secure password for your account.</p>
            </div>
            
            <form @submit.prevent="handleResetPassword">
              
              <!-- New Password Field -->
              <div class="mb-3">
                <label class="form-label text-muted-light fw-medium">New Password</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0">
                    <i class="fas fa-lock text-gold-faded"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control border-start-0 ps-0" 
                    v-model="newPassword" 
                    required 
                    placeholder="Min 6 characters"
                  >
                </div>
              </div>

              <!-- Confirm New Password Field -->
              <div class="mb-4">
                <label class="form-label text-muted-light fw-medium">Confirm New Password</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0">
                    <i class="fas fa-lock text-gold-faded"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control border-start-0 ps-0" 
                    v-model="confirmPassword" 
                    required 
                    placeholder="Repeat new password"
                  >
                </div>
              </div>

              <!-- Submit Button (Primary Action) -->
              <button class="btn btn-gold w-100 py-3 fw-bold shadow-lg text-uppercase" type="submit" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'UPDATING...' : 'SET NEW PASSWORD' }}
              </button>
              
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

export default {
    // Component local state
    data() {
        return {
            // Retrieves the reset token from the Vue Router parameters
            token: this.$route.params.token, 
            newPassword: '',
            confirmPassword: '',
            isLoading: false,
        }
    },
    
    // Component methods
    methods: {
        // Validates password matching and length, then sends the new password and token to the API.
        async handleResetPassword() {
            // Client-side validation check
            if (this.newPassword !== this.confirmPassword) {
                Swal.fire('Validation Error', 'New passwords do not match.', 'error');
                return;
            }
            if (this.newPassword.length < 6) {
                Swal.fire('Validation Error', 'New password must be at least 6 characters.', 'error');
                return;
            }
            
            this.isLoading = true;
            try {
                // API Endpoint: PUT /api/auth/resetpassword/:token
                await api.put(`/auth/resetpassword/${this.token}`, {
                    password: this.newPassword
                });

                // Success notification and redirect
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your password has been reset. Please log in with your new password.',
                    confirmButtonText: 'Go to Login',
                    customClass: { confirmButton: 'btn-gold-swal' }
                }).then(() => {
                    this.$router.push('/login');
                });

            } catch (error) {
                console.error('Password Reset Error:', error);
                const msg = error.response?.data?.msg || 'Invalid or expired reset link. Please check the URL or request a new link.';
                Swal.fire({
                    icon: 'error',
                    title: 'Reset Failed',
                    text: msg
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
/* Custom Colors/Variables (Replicating Login.vue styles for consistency) */
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4)); }
.text-gold-faded { color: rgba(255, 215, 0, 0.6); }
.text-muted-light { color: #bdbdbd; }

/* -------------------------------------------
 * LUXURY FORM CARD (Matching other auth views)
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
    /* Focus effect defined in App.vue is preserved */
}

/* SweetAlert button styling */
.btn-gold-swal {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>