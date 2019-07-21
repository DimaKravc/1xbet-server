let jwt = require('jsonwebtoken')

let config = require('../config')

let User = require('../user/User')

let verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token.startsWith('Career ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(403).send({ auth: false, error: 'No token provided.' })
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ auth: false, error: 'Token has expired.' })
            }

            return res.status(403).send({ auth: false, error: 'Failed to authenticate token.' })
        }

        User.searchById(decoded.user_id, (err, user) => {
            if (err) {
                return res.status(404).send({ auth: false, error: 'User does not exist.' })
            }

            req.user_id = decoded.user_id;

            next()
        })
    })
}

module.exports = verifyToken
