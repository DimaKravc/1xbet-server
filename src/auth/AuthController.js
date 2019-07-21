let express = require('express')
let bodyParser = require('body-parser')

let User = require('../user/User')

let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
let config = require('../config')

let router = express.Router()

router.use(bodyParser.json())

router.post('/signin', (req, res) => {
    let { email, password } = req.body

    if (!email) {
        res.status(500).send({ auth: false, error: 'Email not transferred.' })
    }

    User.searchByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).send('Error on the server.')
        }

        if (!user) {
            return res.status(404).send({ auth: false, error: 'Incorrect email or password.' })
        }

        let passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) {
            return res.status(404).send({ auth: false, error: 'Incorrect email or password.' })
        }

        let access_token = jwt.sign({ user_id: user.id }, config.jwtSecret, {
            expiresIn: '5m'
        })
        let refresh_token = jwt.sign({ user_id: user.id }, config.jwtSecret, {
            expiresIn: '30m'
        })

        User.searchByIdAndUpdate(user.id, Object.assign({}, user, { refresh_token }), (err, user) => {
            if (err) {
                return res.status(500).send('Error on the server.')
            }
        })

        res.status(200).send({ auth: true, access_token, refresh_token })
    })
})

router.post('/signup', (req, res) => {
    let { email, username, password } = req.body

    if (!email || !password) {
        return res.status(500).send({ auth: false, error: 'Email or password not transferred.' })
    }

    User.searchByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).send('Error on the server.')
        }

        if (!user) {
            let hashedPassword = bcrypt.hashSync(password, 8)

            User.search((err, users) => {
                if (err) {
                    return res.status(500).send('Error on the server.')
                }

                let id = users.length + 1

                let access_token = jwt.sign({ user_id: id }, config.jwtSecret, {
                    expiresIn: '5m'
                })
                let refresh_token = jwt.sign({ user_id: id }, config.jwtSecret, {
                    expiresIn: '30m'
                })

                User.create({ email, username, password: hashedPassword, refresh_token }, (err, user) => {
                    if (err) {
                        return res.status(500).send('There was a problem registering the user.')
                    }

                    res.status(200).send({ auth: true, access_token, refresh_token })
                })
            })
        } else {
            return res.status(403).send({ auth: false, error: 'Email address already exists.' })
        }
    })
})

router.post('/refresh', (req, res) => {
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
                return res.status(403).send({ auth: false, error: 'Token has expired.' })
            }

            return res.status(500).send({ auth: false, error: 'Failed to authenticate token.' })
        }

        User.searchById(decoded.user_id, (err, user) => {
            if (err) {
                return res.status(404).send({ auth: false, error: 'User does not exist.' })
            }

            if (token !== user.refresh_token) {
                return res.status(403).send({ auth: false, error: 'Tokens do not match.' })
            }

            let access_token = jwt.sign({ user_id: user.id }, config.jwtSecret, {
                expiresIn: '5m'
            })
            let refresh_token = jwt.sign({ user_id: user.id }, config.jwtSecret, {
                expiresIn: '30m'
            })

            User.searchByIdAndUpdate(user.id, Object.assign({}, user, { refresh_token }), (err, user) => {
                if (err) {
                    return res.status(500).send('Error on the server.')
                }
            })

            res.status(200).send({ auth: true, access_token, refresh_token })
        })
    })
})

module.exports = router
