<template>
  <div id="app">
    <!-- Application navigation component -->
    <Navbar />
    <!-- Main content area for router views -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  // Components registration
  components: {
    Navbar
  }
}
</script>

<style>
/* * -------------------------------------------
 * GLOBAL DARK LUXURY THEME STYLES (Black & Gold)
 * -------------------------------------------
 * This section defines the core visual aesthetic, utilizing deep dark backgrounds
 * and gold accents for a professional, luxurious feel.
 */

:root {
    /* Base Dark Colors */
    --color-dark-primary: #1A1A1A; /* Deep Black for primary surfaces (Navbar, Input BG) */
    --color-dark-secondary: #2C2C2C; /* Slightly lighter dark shade for cards/containers */
    --color-background: #000000; /* PURE BLACK background (The most important fix) */
    
    /* Accent Color (GOLD) */
    --color-accent-gold: #FFD700; /* Standard Gold (Goldenrod) */
    --color-accent-gold-hover: #E6C200; /* Darker gold for hover states */

    /* Text Colors */
    --color-text-light: #F0F0F0; /* Light text for dark backgrounds */
    --color-text-muted: #999999; /* Muted/Subtle text */

    /* Border/Divider Color */
    --color-border-dark: #333333; 
}

/* 1. Base Body & App Container Styles (Fixing the bright background) */
body {
    /* Ensure the HTML body element is pure black */
    background-color: var(--color-background) !important; 
    min-height: 100vh;
    color: var(--color-text-light);
    font-family: 'Inter', sans-serif; 
}

#app {
    /* Ensure the Vue root container covers everything and uses the dark background */
    background-color: var(--color-background);
    min-height: 100vh;
}

/* Utility Class Overrides for Bootstrap Compatibility */

/* Text Utilities */
.text-primary {
    color: var(--color-accent-gold) !important; /* Assigning gold to primary text */
}
.text-muted {
    color: var(--color-text-muted) !important;
}

/* Background Utilities */
.bg-primary {
    background-color: var(--color-dark-primary) !important;
}
/* Replacing light backgrounds with darker shades for theme consistency */
.bg-light, .bg-light-yellow { 
    background-color: var(--color-dark-secondary) !important;
    border-color: var(--color-border-dark) !important;
    color: var(--color-text-light);
}

/* Card Styling (Key UI Element) */
.card {
    background-color: var(--color-dark-secondary);
    border: 1px solid var(--color-border-dark);
    border-radius: 0.5rem; /* Soft rounded corners for luxury feel */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); /* Stronger dark shadow */
    transition: all 0.3s ease;
}
.card:hover {
    /* Slight lift and gold border highlight on hover for engagement */
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.7);
    border: 1px solid var(--color-accent-gold); /* Direct gold border on hover */
}
.card-header {
    border-bottom: 1px solid var(--color-border-dark) !important;
    background-color: var(--color-dark-primary);
}

/* Form Input Styling */
.input-group-text, .form-control {
    background-color: var(--color-dark-primary) !important;
    border-color: var(--color-border-dark) !important;
    color: var(--color-text-light) !important;
    border-radius: 0.3rem;
}
.form-control::placeholder {
    color: #777 !important; /* Slightly lighter placeholder for visibility */
}

/* Custom Gold Utilities (Buttons & Badges) */
.text-gold {
    color: var(--color-accent-gold) !important;
}

/* Primary Action Button (Gold Filled) */
.btn-gold {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important; 
    border-color: var(--color-accent-gold);
    font-weight: 700; /* Bold for action */
    transition: all 0.2s;
}
.btn-gold:hover {
    background-color: var(--color-accent-gold-hover) !important;
    border-color: var(--color-accent-gold-hover);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.6); /* Enhanced Glowing effect */
}

/* Secondary Action Button (Gold Outlined) */
.btn-outline-gold {
    color: var(--color-accent-gold) !important;
    border: 2px solid var(--color-accent-gold) !important;
    font-weight: 600;
}
.btn-outline-gold:hover {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

/* Status/Highlight Badges */
.badge.bg-warning {
    background-color: var(--color-accent-gold) !important;
    color: var(--color-dark-primary) !important;
    font-weight: 700;
}

/* Main Content Padding for layout adjustment */
.main-content {
    /* Increased top padding for better visual spacing below the Navbar */
    padding-top: 3.5rem; 
    padding-bottom: 3rem;
}
</style>