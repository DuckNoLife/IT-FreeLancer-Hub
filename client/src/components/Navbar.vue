<template>
  <nav class="navbar navbar-expand-lg luxury-navbar sticky-top">
    <div class="container py-2">
      
      <!-- Brand Logo/Name -->
      <router-link class="navbar-brand fw-bold text-gold fs-4" to="/">
        <!-- Using a high-impact icon for the platform brand -->
        <i class="fas fa-gem me-2"></i>
        ELITE FREELANCE HUB
      </router-link>
      
      <!-- Toggler for Mobile View -->
      <button class="navbar-toggler border-gold" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation Links and Actions -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          
          <!-- Client Action: Post Job -->
          <li class="nav-item me-3" v-if="user && user.role === 'client'">
            <router-link to="/post-job" class="btn btn-gold btn-sm rounded-pill fw-bold px-4 shadow-lg text-uppercase">
              <i class="fas fa-bullhorn me-1"></i> Post New Opportunity
            </router-link>
          </li>
          
          <!-- Guest State: Login -->
          <li class="nav-item" v-if="!user">
            <router-link class="nav-link nav-link-custom me-2" to="/login">
              <i class="fas fa-sign-in-alt me-1 text-gold"></i> Login
            </router-link>
          </li>
          <!-- Guest State: Registration -->
          <li class="nav-item" v-if="!user">
            <router-link class="btn btn-outline-gold rounded-pill px-4 fw-bold btn-sm" to="/register">
              Sign Up
            </router-link>
          </li>

          <!-- Authenticated User Dropdown Menu -->
          <li class="nav-item dropdown" v-if="user">
            <a class="nav-link dropdown-toggle fw-bold cursor-pointer d-flex align-items-center text-white" 
               href="#" 
               id="navbarDropdown" 
               role="button" 
               data-bs-toggle="dropdown" 
               aria-expanded="false"
            >
              
              <!-- User Avatar or Placeholder Icon -->
              <img 
                  v-if="user.avatarUrl"
                  :src="user.avatarUrl"
                  class="rounded-circle me-2 shadow-sm user-avatar-small"
                  alt="User Avatar"
              >
              <i v-else class="fas fa-user-circle me-2 fs-5 text-gold"></i>
              
              <!-- Username and PRO Status Indicator -->
              {{ user.username }}
              <i v-if="user.isPro" 
                 class="fas fa-star text-gold ms-1 pro-indicator" 
                 title="PRO Member"
              ></i>
            </a>
            
            <!-- Dropdown Menu Content (Dark Luxury Style) -->
            <ul class="dropdown-menu dropdown-menu-end luxury-dropdown shadow-lg" aria-labelledby="navbarDropdown">
              
              <!-- Client Dashboard Link -->
              <li v-if="user.role === 'client'">
                <router-link class="dropdown-item text-gold fw-bold" to="/my-jobs">
                  <i class="fas fa-tachometer-alt me-2"></i> Client Dashboard
                </router-link>
              </li>

              <!-- PRO Upgrade Link -->
              <li>
                <router-link class="dropdown-item text-success-pro fw-bold" to="/upgrade-pro">
                  <i class="fas fa-arrow-alt-circle-up me-2"></i> Upgrade PRO
                </router-link>
              </li>

              <li><hr class="dropdown-divider luxury-divider"></li> 
              
              <!-- Profile Link -->
              <li>
                <router-link class="dropdown-item text-light" to="/profile">
                  <i class="fas fa-user-cog me-2"></i> Account Settings
                </router-link>
              </li>

              <li><hr class="dropdown-divider luxury-divider"></li>
              
              <!-- Logout Action -->
              <li>
                <a class="dropdown-item text-danger fw-bold" href="#" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-2"></i> Sign Out
                </a>
              </li>
            </ul>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
    // Component local state
    data() {
        return {
            user: null // Stores authenticated user object { id, username, role, isPro, avatarUrl }
        }
    },
    
    // Lifecycle Hook: Component mounting
    created() {
        // Initial check for authentication status
        this.checkAuthStatus();
        // Setting up global listener for user state changes (e.g., after login/update)
        window.addEventListener('user-updated', this.checkAuthStatus); 
    },
    
    // Lifecycle Hook: Component destruction
    beforeUnmount() {
        // Removing event listener to prevent memory leaks
        window.removeEventListener('user-updated', this.checkAuthStatus);
    },
    
    // Component Methods
    methods: {
        // Retrieves user data and authentication token from local storage
        // and updates the component state.
        checkAuthStatus() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    // Safely parse user data
                    const parsedUser = JSON.parse(userStr);
                    this.user = {
                        id: parsedUser.id,
                        username: parsedUser.username,
                        role: parsedUser.role,
                        isPro: parsedUser.isPro || false,
                        avatarUrl: parsedUser.avatarUrl,
                    };
                } catch (e) {
                    // Handle corrupted or invalid JSON data in storage
                    console.error("Authentication Error: Invalid user data format in localStorage.", e);
                    this.user = null;
                }
            } else {
                // No valid token or user data found
                this.user = null;
            }
        },
        
        // Clears authentication data from local storage and redirects
        // the user to the login page.
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.user = null;
            // Navigate to the login route after successful logout
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
/* Utility class for clickable elements */
.cursor-pointer {
    cursor: pointer;
}

/* Custom styling for the entire Navbar (Deep Dark Primary Background) */
.luxury-navbar {
    background-color: var(--color-dark-primary) !important;
    border-bottom: 2px solid rgba(255, 215, 0, 0.1); /* Subtle gold line at the bottom */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.7) !important; /* Strong shadow for depth */
}

/* Mobile Toggler Customization */
.navbar-toggler {
    border: 1px solid var(--color-accent-gold) !important;
}

/* Custom styles for Dropdown Menu (Secondary Dark Background) */
.luxury-dropdown {
    background-color: var(--color-dark-secondary) !important;
    border: 1px solid var(--color-border-dark);
    border-radius: 0.5rem;
    min-width: 200px;
}

/* Dropdown Menu Item Style */
.dropdown-item {
    color: var(--color-text-light);
    background-color: transparent !important;
    padding: 0.75rem 1.25rem;
    transition: background-color 0.2s, color 0.2s;
}

/* Dropdown Item Hover Effect: Gold Text on Dark Background */
.dropdown-item:hover, .dropdown-item:focus {
    background-color: #333333 !important; 
    color: var(--color-accent-gold) !important;
}

/* Separator Line Customization */
.luxury-divider {
    border-top: 1px solid #444; 
}

/* Brand Link Gold Color */
.text-gold {
    color: var(--color-accent-gold) !important;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

/* PRO Upgrade Link Custom Color (Vibrant Success) */
.text-success-pro {
    color: #4CAF50 !important;
}

/* User Avatar Styling */
.user-avatar-small {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border: 2px solid var(--color-accent-gold);
}

/* PRO Star Indicator Style */
.pro-indicator {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
}

/* Regular Nav Link Style */
.nav-link-custom {
    color: var(--color-text-light) !important;
    font-weight: 500;
}
</style>