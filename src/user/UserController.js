let express = require('express')
let bodyParser = require('body-parser')

let verifyToken = require('../auth/VerifyToken')

let User = require('./User')

let router = express.Router()

router.use(bodyParser.json())

router.post('/', verifyToken, (req, res) => {
    let { email, password } = req.body

    if (email && password) {
        User.create({ email, password }, (err, user) => {
            if (err) {
                return res.status(500).send('Error on the server.')
            }

            res.status(200).send(user)
        })
    }
})

router.get('/', verifyToken, (req, res) => {
    User.search((err, users) => {
        if (err) {
            return res.status(500).send('Error on the server.')
        }

        res.status(200).send(users)
    })
})

router.get('/me', verifyToken, (req, res) => {
    User.searchById(req.user_id, (err, user) => {
        if (err) {
            return res.status(404).send('User does not exist.')
        }

        let { id, avatar, username } = user

        res.status(200).send({ id, avatar, username })
    })
})

module.exports = router
