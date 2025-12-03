<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10 text-center">
        
        <!-- HEADER -->
        <h1 class="fw-bolder text-gold-highlight mb-3 text-uppercase">
          <i class="fas fa-handshake me-3"></i> Select Your Professional Role
        </h1>
        <p class="text-muted-light lead mb-5">
          This choice determines your platform dashboard. Don't worry, you can easily change this later in your settings.
        </p>
        
        <div class="row g-5">
          
          <!-- OPTION 1: CLIENT -->
          <div class="col-md-6">
            <div 
              class="card h-100 luxury-role-card cursor-pointer" 
              :class="{ 'role-selected': selectedRole === 'client' }"
              @click="selectedRole = 'client'"
            >
              <div class="card-body p-5">
                <div class="mb-4">
                  <!-- Icon -->
                  <i class="fas fa-user-tie fa-5x text-gold-highlight icon-glow"></i>
                </div>
                <h3 class="fw-bolder text-light-high mb-2">I'm a Client</h3>
                <p class="text-muted-light small">
                    **Goal:** Hire elite freelancers, post projects, and manage applications.
                </p>
                <div class="selection-indicator">
                    <i v-if="selectedRole === 'client'" class="fas fa-check-circle text-gold-highlight"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- OPTION 2: FREELANCER -->
          <div class="col-md-6">
            <div 
              class="card h-100 luxury-role-card cursor-pointer"
              :class="{ 'role-selected': selectedRole === 'freelancer' }"
              @click="selectedRole = 'freelancer'"
            >
              <div class="card-body p-5">
                <div class="mb-4">
                  <!-- Icon -->
                  <i class="fas fa-laptop-code fa-5x text-gold-highlight icon-glow"></i>
                </div>
                <h3 class="fw-bolder text-light-high mb-2">I'm a Freelancer</h3>
                <p class="text-muted-light small">
                    **Goal:** Find new projects, apply for jobs, and build professional reputation.
                </p>
                <div class="selection-indicator">
                    <i v-if="selectedRole === 'freelancer'" class="fas fa-check-circle text-gold-highlight"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONFIRMATION BUTTON -->
        <div class="mt-6">
          <button 
            class="btn btn-gold px-6 py-3 fw-bolder shadow-lg text-uppercase" 
            :disabled="!selectedRole || isLoading"
            @click="confirmRole"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Processing...' : 'Confirm Role & Access Portal' }}
          </button>
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
            selectedRole: '', // Stores 'client' or 'freelancer'
            isLoading: false
        }
    },
    
    // Lifecycle Hook: Checks authentication status and role validity
    created() {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            // Must be logged in to access role selection
            this.$router.push('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'pending') {
            // If role is already set, redirect to home
            this.$router.push('/');
        }
    },
    
    // Component methods
    methods: {
        // Submits the selected role to the backend to update the user's account type.
        async confirmRole() {
            if (!this.selectedRole) return;

            this.isLoading = true;
            try {
                // API Endpoint: PUT /api/auth/update-role
                const res = await api.put('/auth/update-role', {
                    role: this.selectedRole
                });

                // Update local storage with the new token and user object (contains the new role)
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                // Notify other components (e.g., Navbar) of the role change
                window.dispatchEvent(new Event('user-updated'));

                // Success notification and redirect
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome aboard!',
                    text: `You have successfully joined as a ${this.selectedRole}.`,
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { popup: 'custom-toast-success' }
                }).then(() => {
                    // Force full reload to ensure global state (router) is fully reset
                    window.location.href = '/'; 
                });

            } catch (error) {
                console.error('Role Update Error:', error);
                Swal.fire('Error', 'Failed to finalize your account role.', 'error');
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
.text-muted-light { color: #bdbdbd; }
.text-light-high { color: #f0f0f0; } 
.text-gold { color: var(--color-accent-gold) !important; }

/* Utility class for icon size */
.fa-5x { font-size: 5em; }
.mt-6 { margin-top: 4rem !important; } /* Custom margin */

/* -------------------------------------------
 * LUXURY ROLE CARDS
 * ------------------------------------------- */
.luxury-role-card {
    /* Deep Slate Gray Card Background (matching other luxury forms) */
    background-color: #1F1F1F !important; 
    border: 1px solid #444; /* Subtle dark border */
    border-radius: 1rem;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.2); /* Spring-like transition */
}

/* Hover Effect: Card lifts and glows softly */
.luxury-role-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.2); 
}

/* Selected State: Strong Gold Border and Shadow */
.role-selected {
    border: 3px solid var(--color-accent-gold) !important; 
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6) !important; 
    transform: translateY(-8px) scale(1.02); /* Ensure selected state maintains visual lift */
}

/* Icon Gold Glow */
.icon-glow {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

/* Hide the crude default radio button */
.form-check {
    opacity: 0;
    height: 0;
    margin: 0;
    padding: 0;
}

/* Custom Checkmark Indicator Styling */
.selection-indicator {
    min-height: 24px;
    font-size: 1.5rem;
}
.role-selected .selection-indicator i {
      /* Ensure the check icon is pure gold and slightly glows */
    color: var(--color-accent-gold) !important;
    filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.8));
}
</style>