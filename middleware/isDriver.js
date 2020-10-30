const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("no token provided");

    try {
        const decoded = jwt.verify(token, "whiz");
        req.user = decoded;
        if (req.user.isClient && !req.user.isAdmin) return res.status(401).send('user is not driver')
        next();
    } catch (ex) {
        return res.status(400).send("invalid token");
    }
};