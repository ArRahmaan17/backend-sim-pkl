const { verify } = require('jsonwebtoken')
const Authenticated = (req, res, next) => {
    const accessToken = req.header('X-ACCESS-TOKEN');
    if (!accessToken) return res.json({ message: 'Unauthenticated' }, 403);
    const validToken = verify(accessToken, 'mamanrecing');
    req.user = validToken;
    if (validToken) {
        return next();
    } else {
        return res.json({ err })
    }
}

module.exports = { Authenticated }