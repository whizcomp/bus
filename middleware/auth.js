const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("no token provided");

    try {
        const decoded = jwt.verify(token, "whiz");
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(400).send("invalid token");
    }
};