<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        
        <!-- Registration Card (Luxury Style) -->
        <div class="card luxury-form-card shadow-3xl mt-4">
          <div class="card-body p-4 p-sm-5">
            
            <div class="text-center mb-5">
                <i class="fas fa-users-crown text-gold-highlight mb-3" style="font-size: 2.5rem;"></i>
                <h2 class="card-title fw-bolder mb-0 text-gold-highlight text-uppercase">Establish Profile</h2>
                <p class="text-muted-light mt-1 small">Join our elite network of clients and developers.</p>
            </div>
            
            <form @submit.prevent="handleRegister">
              
              <!-- Username Field -->
              <div class="mb-3">
                <label class="form-label text-muted-light fw-medium">Full Name / Username</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0"><i class="fas fa-user text-gold-faded"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" v-model="username" required placeholder="John Doe">
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label class="form-label text-muted-light fw-medium">Email Address</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0"><i class="fas fa-envelope text-gold-faded"></i></span>
                  <input type="email" class="form-control border-start-0 ps-0" v-model="email" required placeholder="name@example.com">
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label class="form-label text-muted-light fw-medium">Password</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0"><i class="fas fa-lock text-gold-faded"></i></span>
                  <input type="password" class="form-control border-start-0 ps-0" v-model="password" required placeholder="Min 6 characters">
                </div>
              </div>
              
              <!-- Phone Number Field -->
              <div class="mb-4">
                <label class="form-label text-muted-light fw-medium">Phone Number (Optional)</label>
                <div class="input-group luxury-input-group">
                  <span class="input-group-text border-end-0"><i class="fas fa-phone text-gold-faded"></i></span>
                  <input type="tel" class="form-control border-start-0 ps-0" v-model="phone" placeholder="e.g. 0901234567">
                </div>
              </div>

              <!-- Role Selection (Enhanced UI) -->
              <div class="mb-4">
                <label class="form-label text-muted-light fw-medium d-block">Account Purpose:</label>
                <div class="btn-group luxury-role-select w-100" role="group">
                  
                  <input type="radio" class="btn-check" name="role" id="client" value="client" v-model="role">
                  <label class="btn btn-outline-gold py-2" for="client">
                    <i class="fas fa-user-tie me-2"></i> Hire Talent
                  </label>

                  <input type="radio" class="btn-check" name="role" id="freelancer" value="freelancer" v-model="role">
                  <label class="btn btn-outline-gold py-2" for="freelancer">
                    <i class="fas fa-laptop-code me-2"></i> Seek Projects
                  </label>
                </div>
              </div>

              <!-- Register Button (Primary Action) -->
              <button class="btn btn-gold w-100 py-3 fw-bold shadow-lg text-uppercase" type="submit" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'PROCESSING...' : 'REGISTER' }}
              </button>
            </form>
          </div>
          
          <!-- Card Footer: Login Link (Fixed visibility and hover) -->
          <div class="card-footer luxury-footer text-center py-3">
            <span class="text-muted-light small">Already have an account? </span>
            <router-link to="/login" class="fw-bold text-decoration-none text-gold-highlight footer-link-hover">
                Login Here
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

// View component for user registration
export default {
    // Component state definition
    data() {
        return {
            username: '',
            email: '',
            password: '',
            phone: '', 
            role: 'client', // Default role selection
            isLoading: false
        }
    },
    
    // Component methods
    methods: {
        // Client-side validation for mandatory fields and format rules.
        validateForm() {
            if (this.password.length < 6) {
                Swal.fire('Validation Error', 'Password must be at least 6 characters.', 'error');
                return false;
            }
            
            // Basic check for phone number format (digits only)
            if (this.phone && !/^[0-9]+$/.test(this.phone.trim())) {
                Swal.fire('Validation Error', 'Phone number must contain only digits (0-9).', 'error');
                return false;
            }

            return true;
        },

        // Handles the form submission, registers the new user via API.
        async handleRegister() {
            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;
            try {
                // API Endpoint: POST /api/auth/register
                await api.post('/auth/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                    skills: [],
                    phone: this.phone.trim()
                });

                // Success notification with redirect prompt
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'Your professional profile has been established. Please log in to continue.',
                    confirmButtonText: 'Go to Login',
                    customClass: { confirmButton: 'btn-gold-swal' }
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$router.push('/login');
                    }
                });

            } catch (error) {
                console.error('Registration Error:', error);
                const msg = error.response?.data?.msg || 'Registration failed. Please try a different email.';
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
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
 * LUXURY FORM CARD (Matching Login.vue)
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

/* -------------------------------------------
 * ROLE SELECTION (Enhanced Gold Toggle)
 * ------------------------------------------- */
.luxury-role-select .btn-outline-gold {
    border-color: #555 !important; /* Slightly softer border when not selected */
    color: #999 !important; /* Muted color when not selected */
    font-weight: 500;
    transition: all 0.2s ease;
}

/* State when the radio button IS CHECKED */
.luxury-role-select .btn-check:checked + .btn-outline-gold {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
    border-color: var(--color-accent-gold) !important;
    font-weight: 700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); /* Gold glow on selection */
    z-index: 1; /* Bring selected button forward */
}
/* Hover state for selection buttons */
.luxury-role-select .btn-outline-gold:hover {
    color: var(--color-accent-gold) !important;
    border-color: var(--color-accent-gold) !important;
}

/* -------------------------------------------
 * FOOTER STYLING
 * ------------------------------------------- */
.luxury-footer {
    background-color: var(--color-dark-primary) !important;
    border-top: 1px solid #333 !important;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

/* Footer Link Hover Effect (Copied from Login.vue) */
.footer-link-hover {
    transition: color 0.2s ease, text-shadow 0.2s ease;
    color: var(--color-accent-gold) !important;
}
.footer-link-hover:hover {
    color: var(--color-text-light) !important;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* SweetAlert button styling */
.btn-gold-swal {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
}
</style>