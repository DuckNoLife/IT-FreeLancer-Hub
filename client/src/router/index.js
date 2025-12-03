import { createRouter, createWebHistory } from 'vue-router'

// View imports
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import PostJob from '@/views/PostJob.vue'
import JobDetails from '@/views/JobDetails.vue'
import SelectRole from '@/views/SelectRole.vue' 
import MyJobs from '@/views/MyJobs.vue'
import JobApplications from '@/views/JobApplications.vue'
import Profile from '@/views/Profile.vue'
import UpgradePro from '@/views/UpgradePro.vue'

import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    // Route definitions
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/post-job',
            name: 'post-job',
            component: PostJob
        },
        // Job details route
        {
            path: '/jobs/:id',
            name: 'job-details',
            component: JobDetails
        },
        // Role selection route
        {
            path: '/select-role',
            name: 'select-role',
            component: SelectRole
        },
        // Client dashboard route
        {
            path: '/my-jobs',
            name: 'my-jobs',
            component: MyJobs
        },
        // Job applications list route
        {
            path: '/jobs/:jobId/applications', 
            name: 'job-applications',
            component: JobApplications
        },
        // User profile route
        {
            path: '/profile',
            name: 'profile',
            component: Profile
        },
        // PRO upgrade route
        {
            path: '/upgrade-pro',
            name: 'upgrade-pro',
            component: UpgradePro
        },
        
        // Password management: Forgot password
        {
            path: '/forgot-password',
            name: 'forgot-password',
            component: ForgotPassword
        },
        // Password management: Reset password (token required)
        {
            path: '/reset-password/:token',
            name: 'reset-password',
            component: ResetPassword
        }
    ]
})

export default router