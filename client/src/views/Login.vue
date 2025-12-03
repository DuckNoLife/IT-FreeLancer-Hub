<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-5">
        
        <!-- Login Card (Luxury Style) -->
        <div class="card luxury-form-card shadow-3xl mt-4">
          <div class="card-body p-4 p-sm-5">
            
            <div class="text-center mb-5">
                <i class="fas fa-user-lock text-gold-highlight mb-3" style="font-size: 2.5rem;"></i>
                <h2 class="card-title fw-bolder mb-0 text-gold-highlight text-uppercase">Access Portal</h2>
                <p class="text-muted-light mt-1 small">Secure login for top professionals.</p>
            </div>
            
            <form @submit.prevent="handleLogin">
              
              <!-- Email Field -->
              <div class="mb-3">
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
                    placeholder="Enter your professional email"
                  >
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-4">
                <label class="form-label text-muted-light fw-medium">Password</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0">
                    <i class="fas fa-lock text-gold-faded"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control border-start-0 ps-0" 
                    v-model="password" 
                    required 
                    placeholder="••••••••"
                  >
                </div>
              </div>

              <!-- Login Button (Primary Action) -->
              <button class="btn btn-gold w-100 py-3 fw-bold shadow-lg text-uppercase" type="submit" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'AUTHENTICATING...' : 'LOGIN' }}
              </button>

              <!-- Separator OR -->
              <div class="text-center my-4 position-relative">
                <hr class="position-absolute w-100 top-50 m-0 luxury-divider">
                <span class="position-relative px-3 text-muted-light small luxury-divider-text">OR</span>
              </div>
              
              <!-- Google Login -->
              <div class="d-flex justify-content-center mb-3">
                <GoogleLogin :callback="handleGoogleCallback" :buttonConfig="googleBtnConfig" />
              </div>

              <!-- Forgot Password Link -->
              <div class="text-center mt-4">
                <router-link to="/forgot-password" class="text-decoration-none small text-gold-faded hover-gold">
                    <i class="fas fa-key me-1"></i> Recover Password
                </router-link>
              </div>
            </form>
          </div>
          
          <!-- Card Footer: Sign Up Link -->
          <div class="card-footer luxury-footer text-center py-3">
            <span class="text-muted-light small">Need an account? </span>
            <router-link to="/register" class="fw-bold text-decoration-none text-gold-highlight footer-link-hover">
                Create Account
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import Swal from 'sweetalert2';
import { GoogleLogin } from 'vue3-google-login';

export default {
    // Component dependencies
    components: {
        GoogleLogin
    },
    
    // Component state definition
    data() {
        return {
            email: '',
            password: '',
            isLoading: false,
            // Google button configuration
            googleBtnConfig: {
                text: 'signin_with',
                locale: 'en',
                theme: 'outline', 
                size: 'large',
                width: '280'
            }
        }
    },
    
    // Component methods
    methods: {
        // Handle successful API response (stores data, redirects)
        handleAuthResponse(res) {
            // Persist authentication data
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Check user role
            if (res.data.user.role === 'pending') {
                // Redirect to role selection
                Swal.fire({
                    icon: 'info',
                    title: 'Almost there!',
                    text: 'Please select your account type to continue.',
                    confirmButtonText: 'Select Role',
                    allowOutsideClick: false,
                    customClass: { confirmButton: 'btn btn-gold' }
                }).then(() => {
                    this.$router.push('/select-role');
                });
            } else {
                // Successful login, redirect to home
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: `Welcome back, ${res.data.user.username}!`,
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'custom-toast-success' }
                }).then(() => {
                    // Force full page reload for Navbar state sync
                    window.location.href = '/';
                });
            }
        },

        // Handle Google Sign-In response
        async handleGoogleCallback(response) {
            try {
                const res = await api.post('/auth/google', {
                    credential: response.credential
                });
                this.handleAuthResponse(res);
            } catch (error) {
                console.error('Google Auth Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Google Login Failed',
                    text: error.response?.data?.msg || 'Could not verify Google Token'
                });
            }
        },

        // Handle traditional email/password login
        async handleLogin() {
            this.isLoading = true;
            try {
                const res = await api.post('/auth/login', {
                    email: this.email,
                    password: this.password
                });
                this.handleAuthResponse(res);
            } catch (error) {
                const msg = error.response?.data?.msg || 'Authentication failed. Please check your credentials.';
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
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
/* Custom Colors/Variables */
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4)); }
.text-gold-faded { color: rgba(255, 215, 0, 0.6); }
.text-muted-light { color: #bdbdbd; }
.hover-gold:hover { color: var(--color-accent-gold) !important; }

/* -------------------------------------------
 * LUXURY FORM CARD
 * ------------------------------------------- */
.luxury-form-card {
    /* Deep Slate Gray for card background, contrasting with pure black body */
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

/* Input Group Styling */
.luxury-input-group .input-group-text {
    /* Match input background color and border style */
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

/* Separator OR Styling */
.luxury-divider {
    border-color: #333 !important;
}
.luxury-divider-text {
    background-color: #1F1F1F; /* Match card background to mask the hr line */
    color: #999;
}

/* Footer Styling */
.luxury-footer {
    background-color: var(--color-dark-primary) !important; /* Darker footer */
    border-top: 1px solid #333 !important;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

/* NEW: Footer Link Hover Effect */
.footer-link-hover {
    transition: color 0.2s ease, text-shadow 0.2s ease;
    color: var(--color-accent-gold) !important; /* Ensure it's gold initially */
}
.footer-link-hover:hover {
    color: var(--color-text-light) !important; /* Change to white/light on hover */
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Subtle white glow */
}
</style>