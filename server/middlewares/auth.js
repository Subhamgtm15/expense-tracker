const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // 1️⃣ Get Authorization header
    const authHeader = req.headers.authorization;

    // 2️⃣ If no header → user not logged in
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // 3️⃣ Format: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    // 4️⃣ Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5️⃣ Save user info for later routes
        req.user = decoded; // { id, username }

        // 6️⃣ Allow request to continue
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
