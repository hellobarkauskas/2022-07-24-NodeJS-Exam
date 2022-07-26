const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authorised = (req, res, next) => {
    const authorisation = req.headers.authorization;

    if (!authorisation) {
        return res.status(400).send({ error: 'Token is missing' });
    }

    const token = authorisation.split(' ')[1];

    try {
        const tokenData = jwt.verify(token, jwtSecret);
        
        req.user = {
            userId: tokenData.user_id,
        }

        next();
    } catch {
        res.status(401).send({ error: 'Unauthorised'});
    }
}

module.exports = { authorised }