<template>
  <div class="container py-5">
    
    <!-- HEADER: Professional Page Title (Increased prominence) -->
    <div class="text-center mb-6 luxury-header">
      <h1 class="display-3 fw-bolder text-gold text-uppercase">
        <i class="fas fa-briefcase me-4"></i>
        Elite Career Portal
      </h1>
      <p class="lead text-muted-light mt-3">Discover exclusive opportunities and connect with top-tier clients globally.</p>
    </div>

    <!-- SEARCH BAR SECTION (Centralized Command Block) -->
    <div class="row mb-6">
      <div class="col-lg-10 mx-auto">
        <div class="search-command-block rounded-4 shadow-2xl overflow-hidden border border-gold-subtle">
          
          <!-- Search Inputs Wrapper -->
          <div class="d-flex w-100 search-inputs-wrapper">
            
            <!-- Keyword Search Input -->
            <div class="input-group search-input-group flex-grow-1">
              <span class="input-group-text bg-dark-input border-0">
                <i class="fas fa-search text-gold"></i>
              </span>
              <input 
                type="text" 
                class="form-control bg-dark-input text-light placeholder-gold-muted" 
                placeholder="Search by Job Title or Description..." 
                v-model="keyword"
                @keyup.enter="fetchJobs"
              >
            </div>
            
            <!-- Skill Filter Input (Added border for separation) -->
            <div class="input-group search-input-group flex-grow-1 border-start border-luxury-separator">
              <span class="input-group-text bg-dark-input border-0">
                <i class="fas fa-code text-gold"></i>
              </span>
              <input 
                type="text" 
                class="form-control bg-dark-input text-light placeholder-gold-muted" 
                placeholder="Filter by Technical Skill (e.g., React, AI)" 
                v-model="skill"
                @keyup.enter="fetchJobs"
              >
            </div>
            
          </div>
          
          <!-- Primary Action Button (Gold) -->
          <button class="btn btn-gold px-6 fw-bold text-uppercase search-button" @click="fetchJobs">
            <i class="fas fa-arrow-right me-2"></i> SEARCH
          </button>
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-gold" role="status" style="width: 3.5rem; height: 3.5rem;">
        <span class="visually-hidden">Loading Job Listings...</span>
      </div>
      <p class="mt-4 fs-5 text-gold">Fetching premium opportunities...</p>
    </div>

    <!-- NO DATA STATE -->
    <div v-else-if="jobs.length === 0" class="text-center py-5 card luxury-card-empty">
      <i class="fas fa-hand-holding-box text-gold mb-3" style="font-size: 5rem;"></i>
      <h5 class="mt-3 text-light fw-bold">No Job Listings Available</h5>
      <p class="text-muted-light">The current filter criteria returned no matching professional listings. Try broadening your search terms.</p>
    </div>

    <!-- JOB LISTING GRID -->
    <div v-else class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="job in jobs" :key="job._id">
        <!-- Renders individual job post using the JobCard component -->
        <JobCard :job="job" />
      </div>
    </div>
  </div>
</template>

<script>
import jobService from '../services/jobService';
import JobCard from '../components/JobCard.vue';

export default {
    // Component dependencies
    components: {
        JobCard
    },
    
    // Component State Definition
    data() {
        return {
            jobs: [],
            keyword: '',
            skill: '',
            isLoading: false
        }
    },
    
    // Lifecycle Hook
    created() {
        this.fetchJobs();
    },
    
    // Component Methods
    methods: {
        async fetchJobs() {
            this.isLoading = true;
            try {
                const params = {};
                if (this.keyword) params.keyword = this.keyword;
                if (this.skill) params.skill = this.skill;

                const res = await jobService.getAllJobs(params);
                this.jobs = res.data;
            } catch (error) {
                console.error('API Error: Failed to fetch job listings.', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
/* Custom local variables */
.text-gold { color: var(--color-accent-gold) !important; }
.text-muted-light { color: #ccc; }
.bg-dark-input { background-color: var(--color-dark-primary) !important; }
.border-gold-subtle { border-color: rgba(255, 215, 0, 0.3) !important; }
.border-luxury-separator { border-color: #444 !important; }

/* -------------------------------------------
 * 1. HEADER IMPROVEMENTS
 * ------------------------------------------- */
.luxury-header .display-3 {
    letter-spacing: 0.1em;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.4); /* Stronger gold glow */
}
.mb-6 { margin-bottom: 4rem !important; }


/* -------------------------------------------
 * 2. SEARCH BAR OPTIMIZATION (Command Block)
 * ------------------------------------------- */
.search-command-block {
    display: flex;
    background-color: var(--color-dark-primary);
    padding: 0.5rem; /* Padding around the block */
    transition: box-shadow 0.3s ease;
}

.search-command-block:focus-within {
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5), 0 10px 30px rgba(0, 0, 0, 0.7) !important; /* Gold ring effect on focus */
}

.search-inputs-wrapper {
    display: flex;
    flex-grow: 1;
}

.search-input-group {
    /* Base style for input groups inside the block */
    background-color: var(--color-dark-primary) !important;
}

/* Custom Input Field Look */
.form-control {
    border: none !important; 
    font-size: 1.1rem; /* Slightly larger text */
    padding-left: 0.5rem !important;
}

/* Placeholder color adjustment */
.placeholder-gold-muted::placeholder {
    color: rgba(255, 215, 0, 0.4) !important; /* Faded gold placeholder */
    font-style: italic;
}

/* Focus state */
.form-control:focus {
    box-shadow: none !important; /* Remove inner shadow to keep block clean */
    background-color: var(--color-dark-primary) !important;
}

/* Input Group Text (Icon container) */
.input-group-text {
    background-color: var(--color-dark-primary) !important;
    border: none !important;
    padding-right: 0;
}

/* Search Button Style */
.search-button {
    flex-shrink: 0;
    margin-left: 0.5rem; /* Space between inputs and button */
    border-radius: 0.5rem; /* Match card styling */
}

/* -------------------------------------------
 * 3. OTHER UI IMPROVEMENTS
 * ------------------------------------------- */

/* Empty State Card */
.luxury-card-empty {
    background-color: var(--color-dark-secondary) !important;
    border: 1px solid #444;
    border-radius: 0.75rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.fa-hand-holding-box {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
}
</style>