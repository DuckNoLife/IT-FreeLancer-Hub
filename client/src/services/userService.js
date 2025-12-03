import api from './api';
import Swal from 'sweetalert2';

// Toast configuration
const TOAST_CONFIG = {
    icon: 'success',
    title: 'Update Successful!',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'custom-toast-success'
    }
};

// Utility: Synchronize user state across components
const synchronizeUserState = (user) => {
    // Local storage update
    localStorage.setItem('user', JSON.stringify(user));

    // Global event dispatch
    window.dispatchEvent(new Event('user-updated'));
    
    // Success notification
    Swal.fire(TOAST_CONFIG);
};

// API Service: User Profile Management
export default {
    
    // Fetch user profile
    getProfile() {
        return api.get('/users/profile');
    },

    // Update general profile details
    updateProfile(data) {
        return api.put('/users/profile', data)
            .then(res => {
                synchronizeUserState(res.data);
                return res;
            });
    },
    
    // Update username
    updateUsername(newUsername) {
        return api.put('/users/username', { username: newUsername })
            .then(res => {
                synchronizeUserState(res.data);
                return res;
            });
    },

    // Update password
    updatePassword(data) {
        return api.put('/users/password', data);
    },

    // Update avatar URL
    updateAvatar(avatarUrl) {
        return api.put('/users/avatar', { avatarUrl })
            .then(res => {
                synchronizeUserState(res.data);
                return res;
            });
    },
};