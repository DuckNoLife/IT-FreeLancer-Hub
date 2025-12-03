const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    // Relationship: Job and Freelancer references
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    freelancerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Application content
    coverLetter: { 
        type: String, 
        required: true 
    }, 
    
    // Application status
    // 'pending': Submitted, contact hidden
    // 'contacting': Client accepted, contact revealed
    // 'rejected': Rejected
    status: { 
        type: String, 
        enum: ['pending', 'contacting', 'rejected'], 
        default: 'pending' 
    },
    
    // Timestamp
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);