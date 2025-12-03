<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10 col-lg-9">
        
        <!-- HEADER -->
        <h1 class="fw-bolder text-gold-highlight mb-5 text-center">
          <i class="fas fa-user-cog me-3"></i>
          Account Management Portal
        </h1>

        <!-- LOADING STATE -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-gold" role="status" style="width: 3.5rem; height: 3.5rem;"></div>
          <p class="text-muted-light mt-3 fs-5">Retrieving sensitive profile data...</p>
        </div>

        <!-- PROFILE CONTENT -->
        <div v-else class="row g-4">
          
          <!-- COLUMN LEFT: General Info & Avatar/Username -->
          <div class="col-lg-7">
            
            <!-- CARD 1: GENERAL INFORMATION -->
            <div class="card luxury-card-enhanced mb-4 shadow-xl">
              <div class="card-header bg-dark-primary text-light fw-bold p-3 border-bottom-luxury"> 
                <i class="fas fa-info-circle me-2 text-gold-faded"></i> Profile Details & Contact
              </div>
              <div class="card-body p-4">
                
                <!-- AVATAR & USERNAME SECTION -->
                <div class="d-flex align-items-center mb-4 pb-3 border-bottom border-luxury-separator">
                  
                  <!-- Avatar Display -->
                  <img :src="avatarPreviewUrl || defaultAvatar" class="avatar-display me-4" alt="Avatar">
                  
                  <!-- Username and Role Info -->
                  <div>
                    <div class="d-flex align-items-center mb-1">
                      
                        <!-- Username Display/Edit Input -->
                        <h4 v-if="!isEditingUsername" class="mb-0 fw-bold me-2 text-light-high username-text">
                            {{ form.username }}
                        </h4>
                        <input 
                            v-else 
                            type="text" 
                            class="form-control form-control-sm luxury-input me-2" 
                            v-model="newUsername" 
                            required
                        >
                        
                        <!-- Edit/Save Username Button -->
                        <button 
                            @click="toggleUsernameEdit"
                            class="btn btn-sm btn-gold-icon transition-ease"
                            :disabled="isSubmittingUsername"
                        >
                            <span v-if="isSubmittingUsername" class="spinner-border spinner-border-sm"></span>
                            <i v-else :class="isEditingUsername ? 'fas fa-save' : 'fas fa-edit'"></i>
                        </button>
                        
                        <!-- PRO Member Indicator -->
                        <i v-if="form.isPro" class="fas fa-crown text-gold ms-2 pro-indicator" title="PRO Member"></i>
                    </div>
                    
                    <small class="text-muted-light d-block mb-2">{{ form.email }}</small>
                    
                    <!-- Role and Reputation Badges -->
                    <span 
                      class="badge text-uppercase py-1 px-3 fw-bold role-badge"
                      :class="form.role === 'freelancer' ? 'bg-freelancer-role' : 'bg-client-role'"
                    >
                      {{ form.role }}
                    </span>
                    <span v-if="form.role === 'freelancer'" class="badge bg-dark-skill ms-1 text-gold-faded px-3 py-1 fw-bold">
                      Reputation: {{ form.reputation || 0 }}
                    </span>
                  </div>
                </div>
                
                <!-- AVATAR UPLOAD FORM -->
                <div class="mb-4">
                    <label class="form-label fw-bold small text-gold-faded">Update Profile Picture</label>
                    <div class="d-flex align-items-center">
                        <input 
                            type="file" 
                            @change="handleAvatarFileChange" 
                            ref="avatarFile" 
                            class="form-control form-control-sm luxury-input-file" 
                            accept="image/*"
                        >
                        <button 
                            @click="updateAvatar" 
                            :disabled="!avatarFile || isSubmittingAvatar"
                            class="btn btn-gold btn-sm ms-2"
                        >
                          <span v-if="isSubmittingAvatar" class="spinner-border spinner-border-sm me-1"></span>
                          {{ isSubmittingAvatar ? 'Uploading...' : 'Upload & Save' }}
                        </button>
                    </div>
                </div>

                <!-- PHONE & SKILLS FORM -->
                <form @submit.prevent="updateGeneralInfo">
                  <h6 class="fw-bold text-light-high mb-3 border-top border-luxury-separator pt-3"><i class="fas fa-clipboard-list me-2 text-gold-faded"></i> Essential Details</h6>

                  <div class="mb-3">
                    <label class="form-label fw-bold text-muted-light">Phone Number</label>
                    <input 
                      type="tel" 
                      class="form-control luxury-input" 
                      v-model="form.phone" 
                      placeholder="e.g. 0901234567"
                    >
                  </div>

                  <div class="mb-4" v-if="form.role === 'freelancer'">
                    <label class="form-label fw-bold text-muted-light">Skills (Comma-separated)</label>
                    <textarea 
                      class="form-control luxury-input" 
                      v-model="skillsInput" 
                      rows="3" 
                      placeholder="e.g. Vue.js, Node.js, MongoDB, REST API"
                    ></textarea>
                    <small class="form-text text-muted-light">
                      Current Skills: 
                      <span v-for="(skill, index) in form.skills" :key="index" class="badge bg-dark-skill text-gold-faded me-1 border border-gold-subtle">
                        {{ skill }}
                      </span>
                    </small>
                  </div>
                  
                  <button type="submit" :disabled="isSubmittingGeneral" class="btn btn-gold fw-bold w-100 py-2 mt-3 text-uppercase shadow-md">
                    <span v-if="isSubmittingGeneral" class="spinner-border spinner-border-sm me-1"></span>
                    Save General Info
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- COLUMN RIGHT: Password & Other Actions -->
          <div class="col-lg-5">
            
            <!-- CARD 2: CHANGE PASSWORD -->
            <div class="card luxury-card-enhanced shadow-xl">
              <div class="card-header bg-dark-primary text-gold fw-bold p-3 border-bottom-luxury"> 
                <i class="fas fa-shield-alt me-2"></i> Security: Change Password
              </div>
              <div class="card-body p-4">
                <form @submit.prevent="updatePassword">
                  <div class="mb-3">
                    <label class="form-label text-muted-light">Current Password</label>
                    <input type="password" class="form-control luxury-input" v-model="passwordForm.oldPassword" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted-light">New Password</label>
                    <input type="password" class="form-control luxury-input" v-model="passwordForm.newPassword" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted-light">Confirm New Password</label>
                    <input type="password" class="form-control luxury-input" v-model="passwordForm.confirmPassword" required>
                  </div>
                  <button type="submit" :disabled="isSubmittingPassword" class="btn btn-gold-outline-dark fw-bold w-100 py-2 mt-2">
                    <span v-if="isSubmittingPassword" class="spinner-border spinner-border-sm me-1"></span>
                    Update Password
                  </button>
                </form>
              </div>
            </div>
            
            <!-- CARD 3: UPGRADE PRO (Placeholder) -->
             <div class="card luxury-card-enhanced luxury-card-promo shadow-xl mt-4">
                <div class="card-body p-4 text-center">
                    <h5 class="fw-bold text-gold-highlight mb-2"><i class="fas fa-rocket me-2"></i> Elevate Your Status</h5>
                    <p class="small text-muted-light mb-4">Unlock advanced features and priority visibility with a PRO Membership.</p>
                    <router-link to="/upgrade-pro" class="btn btn-gold fw-bold px-4 py-2 text-uppercase">
                        Go PRO Now
                    </router-link>
                </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/userService';
import Swal from 'sweetalert2';

export default {
    // Component local state
    data() {
        return {
            isLoading: true,
            isSubmittingGeneral: false,
            isSubmittingPassword: false,
            isSubmittingAvatar: false,
            
            // Username Edit State
            isEditingUsername: false,
            isSubmittingUsername: false,
            newUsername: '',
            
            // Default placeholder for avatar
            defaultAvatar: 'https://placehold.co/100x100/1A1A1A/FFD700?text=USER', 
            
            // Form Data (bound to inputs and API response)
            form: {
                username: '',
                email: '',
                phone: '',
                avatarUrl: '', 
                isPro: false,
                role: '',
                reputation: 0,
                skills: [],
            },
            skillsInput: '', // String representation of skills for textarea input

            // Password Update Form State
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },

            // Avatar Upload State
            avatarFile: null,
            avatarPreviewUrl: null
        };
    },
    
    // Lifecycle Hook: Fetch profile data immediately upon component creation
    created() {
        this.fetchProfile();
    },
    
    // Component Methods
    methods: {
        // Helper to synchronize local form state with the latest user data
        updateFormData(user) {
            this.form.username = user.username;
            this.form.email = user.email;
            this.form.phone = user.phone || '';
            this.form.avatarUrl = user.avatarUrl;
            this.form.isPro = user.isPro;
            this.form.role = user.role;
            this.form.reputation = user.reputation;
            this.form.skills = user.skills || []; 
            this.skillsInput = user.skills ? user.skills.join(', ') : '';
            this.avatarPreviewUrl = user.avatarUrl || this.defaultAvatar;
            
            this.newUsername = user.username; // Sync current username to the edit input
        },

        // Retrieves the full user profile from the backend API.
        async fetchProfile() {
            try {
                const res = await userService.getProfile();
                this.updateFormData(res.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.response?.status === 401) {
                    this.$router.push('/login');
                } else {
                    Swal.fire('Error', 'Failed to load profile data.', 'error');
                }
            } finally {
                this.isLoading = false;
            }
        },

        // Submits updates for phone number and skills to the API.
        async updateGeneralInfo() {
            this.isSubmittingGeneral = true;
            try {
                const skillsArray = this.skillsInput.split(',').map(s => s.trim()).filter(s => s);
                
                const payload = {
                    phone: this.form.phone,
                    skills: skillsArray
                };

                const res = await userService.updateProfile(payload);
                this.updateFormData(res.data); 

            } catch (error) {
                const msg = error.response?.data?.msg || 'Failed to update general profile information.';
                Swal.fire('Error', msg, 'error');
            } finally {
                this.isSubmittingGeneral = false;
            }
        },
        
        // Toggles between displaying the username and the edit input field.
        async toggleUsernameEdit() {
            if (!this.isEditingUsername) {
                // Transition to Edit Mode
                this.isEditingUsername = true;
                return;
            }

            // --- Transition from Edit Mode (Attempt Save) ---
            if (this.newUsername.trim() === this.form.username) {
                this.isEditingUsername = false; // No change, just close
                return;
            }
            
            if (!this.newUsername.trim()) {
                Swal.fire('Error', 'Username cannot be empty.', 'error');
                return;
            }

            this.isSubmittingUsername = true;
            try {
                const res = await userService.updateUsername(this.newUsername.trim());
                this.updateFormData(res.data); 
                
                // Success toast handled by userService.js
                
                this.isEditingUsername = false; // Close edit mode

            } catch (error) {
                const msg = error.response?.data?.msg || 'Failed to update username. It might already be taken.';
                Swal.fire('Error', msg, 'error');
                this.newUsername = this.form.username; // Revert to old value
            } finally {
                this.isSubmittingUsername = false;
            }
        },
        
        // Submits a request to change the user's password.
        async updatePassword() {
            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                Swal.fire('Validation Error', 'New password and confirmation password do not match.', 'error');
                return;
            }

            if (this.passwordForm.newPassword.length < 6) {
                Swal.fire('Validation Error', 'New password must be at least 6 characters.', 'error');
                return;
            }
            
            this.isSubmittingPassword = true;
            try {
                const payload = {
                    oldPassword: this.passwordForm.oldPassword,
                    newPassword: this.passwordForm.newPassword
                };

                await userService.updatePassword(payload);

                Swal.fire({
                    icon: 'success', 
                    title: 'Password Updated!', 
                    text: 'Your password has been successfully changed.'
                });
                
                // Reset form
                this.passwordForm.oldPassword = '';
                this.passwordForm.newPassword = '';
                this.passwordForm.confirmPassword = '';

            } catch (error) {
                const msg = error.response?.data?.msg || 'Failed to update password. Check your current password.';
                Swal.fire('Error', msg, 'error');
            } finally {
                this.isSubmittingPassword = false;
            }
        },

        // Handles file selection, reading the file and creating a temporary preview URL.
        handleAvatarFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.avatarFile = file;
                this.avatarPreviewUrl = URL.createObjectURL(file);
            } else {
                this.avatarFile = null;
                this.avatarPreviewUrl = this.form.avatarUrl || this.defaultAvatar;
            }
        },

        // Updates the user's avatar URL.
        async updateAvatar() {
            if (!this.avatarFile) return;

            this.isSubmittingAvatar = true;
            
            try {
                // Assume the avatar is uploaded and returns the public URL (using preview URL as placeholder)
                const newAvatarUrl = this.avatarPreviewUrl; 
                
                const res = await userService.updateAvatar(newAvatarUrl);

                this.updateFormData(res.data); 
                
                // Reset file input element
                this.avatarFile = null;
                if (this.$refs.avatarFile) {
                    this.$refs.avatarFile.value = '';
                }
                
            } catch (error) {
                const msg = error.response?.data?.msg || 'Failed to update avatar.';
                Swal.fire('Error', msg, 'error');
                this.avatarPreviewUrl = this.form.avatarUrl || this.defaultAvatar;
            } finally {
                this.isSubmittingAvatar = false;
            }
        }
    }
}
</script>

<style scoped>
/* -------------------------------------------
 * CUSTOM COLORS
 * ------------------------------------------- */
.text-gold-highlight { color: var(--color-accent-gold) !important; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4)); }
.text-gold-faded { color: rgba(255, 215, 0, 0.6); }
.text-muted-light { color: #bdbdbd; }
.text-light-high { color: #f0f0f0; } 
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.bg-dark-skill { background-color: #333333 !important; }
.border-luxury-separator { border-color: #333 !important; }
.border-bottom-luxury { border-bottom: 1px solid #444 !important; }


/* -------------------------------------------
 * LUXURY CARD STYLING
 * ------------------------------------------- */
.luxury-card-enhanced {
    /* Deep Slate Gray Card Background */
    background-color: #1F1F1F !important; 
    border: 1px solid #444;
    border-radius: 1rem;
}
.luxury-card-promo {
    background-color: #1A1A1A !important; 
    border: 1px solid var(--color-accent-gold); 
    border-radius: 1rem;
}


/* -------------------------------------------
 * PROFILE DISPLAY
 * ------------------------------------------- */
.avatar-display {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 50%;
    /* Luxury Border and Shadow */
    border: 3px solid var(--color-accent-gold);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
    transition: transform 0.3s;
}
.avatar-display:hover {
    transform: scale(1.05);
}
.username-text {
    font-size: 1.5rem;
    letter-spacing: 0.02em;
}
.pro-indicator {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
}


/* -------------------------------------------
 * ROLE BADGES (Custom Colors for Clarity)
 * ------------------------------------------- */
.role-badge {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    font-weight: 700;
}
.bg-freelancer-role {
    background-color: #28a745 !important; /* Green */
    color: #fff !important;
}
.bg-client-role {
    background-color: #17a2b8 !important; /* Cyan/Blue */
    color: #fff !important;
}


/* -------------------------------------------
 * INPUT/FORM STYLING
 * ------------------------------------------- */
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
.luxury-input-file {
    background-color: var(--color-dark-primary) !important;
    border-color: #444 !important;
    color: var(--color-text-light) !important;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
}

/* Custom Button for Username Edit */
.btn-gold-icon {
    background-color: transparent !important;
    border: 1px solid #444;
    color: var(--color-accent-gold) !important;
    transition: background-color 0.2s;
}
.btn-gold-icon:hover {
    background-color: #333 !important;
    border-color: var(--color-accent-gold);
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

/* Secondary Action Button (Password Update) */
.btn-gold-outline-dark {
    color: var(--color-accent-gold) !important;
    border: 2px solid var(--color-accent-gold) !important;
    background-color: #1F1F1F !important; /* Card background */
    font-weight: 700;
    transition: all 0.2s;
}
.btn-gold-outline-dark:hover {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.transition-ease {
    transition: all 0.2s ease;
}
</style>