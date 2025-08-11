const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ error: "Access token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid access token" });
        }
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = { verifyToken };