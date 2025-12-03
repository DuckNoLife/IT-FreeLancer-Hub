<template>
  <div class="card h-100 luxury-card transition">
    <div class="card-body p-4 pb-2">
      
      <!-- 1. HEADER: Title and Premium Tag -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h4 class="card-title fw-bolder mb-0 job-title-text">
          <router-link :to="`/jobs/${job._id}`" class="job-title-link text-gold-deep">
            <!-- Using a more formal icon for the title -->
            <i class="fas fa-layer-group me-2"></i>
            {{ job.title }}
          </router-link>
        </h4>
        
        <!-- Premium Badge: Highlighted Gold -->
        <span v-if="job.isPremium" class="badge bg-gold-accent text-dark fw-bold px-3 py-2 shadow-sm rounded-pill premium-tag">
          <i class="fas fa-bolt me-1"></i>
          PREMIUM
        </span>
      </div>

      <!-- 2. METADATA: Client and Location (Enhanced contrast) -->
      <div class="metadata-section mb-3">
          <!-- Client Information -->
          <span class="text-muted-light-high me-4">
            <i class="fas fa-building me-1 text-gold-faded"></i> Posted by: 
            <span class="text-light fw-medium client-username">{{ job.ownerId.username }}</span>
            
            <!-- Pro Client Verification Icon -->
            <i v-if="job.ownerId.isPro" 
               class="fas fa-medal text-gold ms-1 pro-verified" 
               title="Verified Pro Client" 
            ></i>
          </span>
          <!-- Placeholder for Location/Type -->
          <span class="text-muted-light-high d-none d-sm-inline">
              <i class="fas fa-map-marker-alt me-1 text-gold-faded"></i> Remote
          </span>
      </div>

      <!-- 3. DESCRIPTION: Truncated Summary -->
      <p class="card-text text-truncate-3 text-light-high mb-4">
        {{ job.description }}
      </p>

      <!-- 4. SKILLS SECTION -->
      <div class="mb-3 skill-tags">
        <span v-for="(skill, index) in job.requiredSkills" 
              :key="index" 
              class="badge bg-dark-skill text-gold-faded me-2 mb-1 skill-badge"
        >
          <i class="fas fa-tag me-1 opacity-75"></i> {{ skill }}
        </span>
      </div>
    </div>

    <!-- 5. FOOTER: Budget and Action Button (High Contrast) -->
    <div class="card-footer bg-dark-primary border-top-luxury d-flex justify-content-between align-items-center py-3 px-4">
      <!-- Budget Display (Stronger emphasis) -->
      <span class="fw-bolder text-success-gold fs-4 budget-display">
        <i class="fas fa-sack-dollar me-2"></i> {{ formatBudget(job.budget) }}
      </span>
      
      <!-- Action Link -->
      <router-link :to="`/jobs/${job._id}`" class="btn btn-outline-gold btn-sm rounded-pill px-4 py-2 text-uppercase fw-bold shadow-sm">
        <i class="fas fa-arrow-right me-1"></i> VIEW
      </router-link>
    </div>
  </div>
</template>

<script>
// A reusable component displaying a summary of a single job post.
export default {
    // Component properties definition
    props: {
        job: {
            type: Object,
            required: true,
            validator: (value) => value.title && value.description && value.budget !== undefined
        }
    },
    
    // Component methods
    methods: {
        // Formats the job budget into a currency string (e.g., "$10,000").
        formatBudget(budget) {
            // Using USD dollar sign for consistent financial notation
            return `$${new Intl.NumberFormat().format(budget)}`;
        }
    }
}
</script>

<style scoped>
/* Custom local variables/classes based on global definitions in App.vue */
.bg-dark-primary { background-color: var(--color-dark-primary) !important; }
.text-gold-deep { color: var(--color-accent-gold) !important; }
.text-gold-faded { color: rgba(255, 215, 0, 0.5); }
.border-top-luxury { border-top: 1px solid #444 !important; }

/* NEW CUSTOM COLORS FOR ENHANCED CONTRAST */
.text-light-high { color: #f0f0f0; } /* Pure white for main text/description */
.text-muted-light-high { color: #bdbdbd; } /* Lighter gray for metadata */
.bg-dark-skill { background-color: #333333 !important; } /* Slightly darker background for skill chips */
.border-luxury-card { border: 1px solid #444 !important; } /* Darker, clear border */

/* -------------------------------------------
 * CARD STYLING & INTERACTION (Applying new background)
 * ------------------------------------------- */
.luxury-card {
    /* Changed from dark-secondary to a custom deep gray for better contrast against pure black body */
    background-color: #1F1F1F; 
    border-radius: 1rem;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6);
}

.luxury-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 215, 0, 0.4); 
    border: 1px solid var(--color-accent-gold); 
}

/* -------------------------------------------
 * HEADER & TITLE
 * ------------------------------------------- */
.job-title-text {
    font-size: 1.3rem;
    line-height: 1.4;
}
.job-title-link {
    text-decoration: none;
    transition: color 0.2s, text-shadow 0.2s;
}
.job-title-link:hover {
    color: var(--color-accent-gold) !important;
    text-shadow: 0 0 7px rgba(255, 215, 0, 0.6);
}

/* Premium Badge Custom Style */
.premium-tag {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
}

/* -------------------------------------------
 * METADATA & DESCRIPTION (Applying new light text colors)
 * ------------------------------------------- */
.metadata-section {
    font-size: 0.9rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
}
.client-username {
    color: var(--color-text-light); 
}
.pro-verified {
    filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
}
.text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.6;
}

/* -------------------------------------------
 * SKILLS & FOOTER
 * ------------------------------------------- */
.skill-badge {
    padding: 0.5em 0.9em;
    border-radius: 0.5rem;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.75rem;
    border: 1px solid #444;
}

/* Budget Display */
.text-success-gold { 
    color: #4CAF50 !important; 
    filter: drop-shadow(0 0 4px rgba(76, 175, 80, 0.7));
}
.budget-display {
    letter-spacing: -0.05em;
}
</style>