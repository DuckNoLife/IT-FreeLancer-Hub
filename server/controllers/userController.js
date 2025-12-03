const User = require('../models/User');
const bcrypt = require('bcryptjs'); 

// Utility: Phone number validation (reused from authController)
const validatePhone = (phone) => {
    // Allows empty string or 7-15 digits
    if (!phone) return true; 
    return /^\d{7,15}$/.test(phone); 
};


// Route definition: GET api/users/profile
exports.getProfile = async (req, res) => {
    try {
        // Find user by ID, exclude password
        const user = await User.findById(req.user.id).select('-password'); 
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: PUT api/users/profile
exports.updateProfile = async (req, res) => {
    try {
        const { phone, skills } = req.body; 

        // Phone validation
        if (phone !== undefined && !validatePhone(phone)) {
            return res.status(400).json({ msg: 'Invalid phone number format (must contain only digits).' });
        }
        
        // Find current user
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update phone
        if (phone !== undefined) {
            user.phone = phone;
        }
        
        // Update skills (Freelancer only)
        if (skills && Array.isArray(skills) && user.role === 'freelancer') {
            user.skills = skills; 
        }

        // Save changes
        await user.save();

        // Return updated user object
        const returnUser = await User.findById(req.user.id).select('-password');
        res.json(returnUser); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Route definition: PUT api/users/password
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        // New password validation
        if (newPassword.length < 6) {
            return res.status(400).json({ msg: 'New password must be at least 6 characters long.' });
        }

        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check old password
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Old password is incorrect' });
        }
        
        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        res.json({ msg: 'Password updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Route definition: PUT api/users/avatar
exports.updateAvatar = async (req, res) => {
    try {
        const { avatarUrl } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Update Avatar URL
        user.avatarUrl = avatarUrl;
        
        await user.save();
        
        // Return updated user object
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Route definition: PUT api/users/username
exports.updateUsername = async (req, res) => {
    try {
        const { username: newUsername } = req.body;

        // Username length validation
        if (!newUsername || newUsername.length < 3) {
            return res.status(400).json({ msg: 'Username must be at least 3 characters.' });
        }

        // Uniqueness check (excluding current user)
        const existingUser = await User.findOne({ 
            username: newUsername,
            _id: { $ne: req.user.id } 
        });

        if (existingUser) {
            return res.status(400).json({ msg: 'This username is already taken by another user.' });
        }
        
        // Find current user
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update username
        user.username = newUsername;
        await user.save();
        
        // Return updated user object
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};