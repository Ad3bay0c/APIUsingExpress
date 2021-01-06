const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(400).json({ msg: "No Token given"});
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: "Invalid Token" });
    }
}