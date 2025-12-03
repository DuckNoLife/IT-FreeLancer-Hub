const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

// Google Auth configuration
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Utility: Phone number validation
const validatePhone = (phone) => {
    // Allows empty string or 7-15 digits
    if (!phone) return true;
    return /^\d{7,15}$/.test(phone); 
};

// Route definition: POST api/auth/register
exports.register = async (req, res) => {
    try {
        const { username, email, password, role, skills, phone } = req.body;

        // Input validation: Password length
        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
        }
        
        // Input validation: Phone format
        if (!validatePhone(phone)) {
            return res.status(400).json({ msg: 'Invalid phone number format (must contain only digits).' });
        }

        // Email check
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Username check
        let userByName = await User.findOne({ username });
        if (userByName) {
            return res.status(400).json({ msg: 'Username already exists. Please choose another one.' });
        }

        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // User creation
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role, 
            skills: role === 'freelancer' ? skills : [], 
            phone: phone || ''
        });

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        // Unique index error handling
        if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(400).json({ msg: 'Registration failed: This email is already registered.' });
            }
            if (err.keyPattern && err.keyPattern.username) {
                return res.status(400).json({ msg: 'Registration failed: This username is already taken.' });
            }
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: POST api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Password match check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // JWT payload creation
        const payload = { user: { id: user.id, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl } };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                // Full user object response
                res.json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        username: user.username, 
                        role: user.role, 
                        isPro: user.isPro, 
                        avatarUrl: user.avatarUrl 
                    } 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: POST api/auth/google
exports.googleLogin = async (req, res) => {
    const { credential } = req.body;

    try {
        // Token verification
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        const { name, email, picture } = ticket.getPayload();

        // User check
        let user = await User.findOne({ email });

        if (user) {
            // Existing user login (Merge logic)
            const payload = { user: { id: user.id, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl } };
            
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl } });
            });

        } else {
            // New user registration
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                username: name,
                email,
                password: hashedPassword, 
                role: 'pending', 
                isPro: false,
                avatarUrl: picture // Set avatar from Google
            });

            await user.save();

            const payload = { user: { id: user.id, role: 'pending' } };
            
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, role: 'pending', isPro: false, avatarUrl: user.avatarUrl } });
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: 'Google Login Failed' });
    }
};

// Route definition: PUT api/auth/role
exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Role input validation
        if (!['client', 'freelancer'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role selection' });
        }

        let user = await User.findById(req.user.id);

        // User existence check
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Role update check
        if (user.role !== 'pending') {
            return res.status(400).json({ msg: 'Role is already set' });
        }

        // Update and save role
        user.role = role;
        await user.save();

        // New token generation with updated role
        const payload = { user: { id: user.id, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl } };

        const token = await new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, t) => {
                if (err) reject(err);
                resolve(t);
            });
        });

        // Response with new token and user object
        res.json({ 
            token, 
            user: { id: user.id, username: user.username, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl }
        });

    } catch (err) {
        console.error("Update Role Error:", err.message);
        res.status(500).json({ msg: 'Failed to select role due to server error' });
    }
};

// Route definition: POST api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        // User existence check
        if (!user) {
            return res.status(404).json({ msg: 'Email could not be sent' });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Construct reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const message = `
            You are receiving this email because you (or someone else) has requested the reset of a password.
            Please click the link below to reset your password:
            \n\n ${resetUrl} \n\n
            If you did not request this, please ignore this email.
        `;

        try {
            // Send email
            await sendEmail({
                email: user.email,
                subject: 'IT Freelancer Hub - Password Reset',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            // Revert token fields on failure
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ msg: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: PUT api/auth/resetpassword/:resettoken
exports.resetPassword = async (req, res) => {
    try {
        // Hash incoming token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        // Find user by token and expiry
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        // Token invalid check
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Token or Token has expired' });
        }
        
        // New password validation
        if (req.body.password.length < 6) {
            return res.status(400).json({ msg: 'New password must be at least 6 characters long.' });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // New JWT generation
        const payload = { user: { id: user.id, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl } };
        
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }, 
            (err, token) => {
                if (err) throw err;
                // Success response with new token
                res.json({ 
                    success: true, 
                    token, 
                    msg: 'Password updated successfully',
                    user: { id: user.id, username: user.username, role: user.role, isPro: user.isPro, avatarUrl: user.avatarUrl }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};