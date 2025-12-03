const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    // Basic fields
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    budget: { 
        type: Number, 
        required: true 
    },
    requiredSkills: [String], 
    
    // Relationship: Job owner reference
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Job status
    status: { 
        type: String, 
        enum: ['open', 'closed'], 
        default: 'open' 
    },
    
    // Promotion flag (Premium visibility)
    isPremium: { 
        type: Boolean, 
        default: false 
    },
    
    // Timestamp
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Job', JobSchema);