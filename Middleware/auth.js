const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        
        if (!token) {
            console.log("Access Denied: No token provided");
            return res.status(403).json({ message: "Access Denied: No token provided" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            console.log("Invalid Token:", err.message);
            res.status(403).json({ message: "Invalid Token" });
        }
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { verifyToken };
