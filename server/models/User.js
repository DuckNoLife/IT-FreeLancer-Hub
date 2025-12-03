const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Schema definition
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    
    password: { 
        type: String, 
        required: true 
    },
    
    role: { 
        type: String, 
        enum: ['client', 'freelancer', 'pending'], 
        default: 'pending' 
    },
    
    phone: { 
        type: String 
    },
    skills: [String],

    avatarUrl: { 
        type: String, 
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    
    isPro: { 
        type: Boolean, 
        default: false 
    },
    reputation: { 
        type: Number, 
        default: 0 
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Schema methods: Password comparison
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Schema methods: Password reset token generation
UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    return resetToken;
};

// Export
module.exports = mongoose.model('User', UserSchema);