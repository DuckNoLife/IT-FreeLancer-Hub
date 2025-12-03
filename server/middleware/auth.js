const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Check Authorization header
    const authHeader = req.header('Authorization');

    // Header validation (Existence and "Bearer " format)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        // Token invalid handling
        res.status(401).json({ msg: 'Token is not valid' });
    }
};