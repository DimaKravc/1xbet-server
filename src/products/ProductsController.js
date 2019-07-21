let express = require('express')
let bodyParser = require('body-parser')

let verifyToken = require('../auth/VerifyToken')

let Products = require('./Products')

let router = express.Router()

router.get('/', verifyToken, (req, res) => {
    Products.search(req.query, (err, products) => {
        if (err) {
            return res.status(500).send('Error on the server.')
        }

        let response = {
            products,
            meta: {
                pagination: {
                    count: Number(req.query.limit),
                    current_page: Number(req.query.page)
                }
            }
        }

        Products.search({}, (err, products) => {
            if (err) {
                return res.status(500).send('Error on the server.')
            }

            response.meta.pagination.total = products.length
            response.meta.pagination.total_pages = Math.ceil(products.length / req.query.limit)

            res.status(200).send(response)
        })
    })
})

router.delete('/', verifyToken, (req, res) => {
    Products.delete(req.query, (err, products) => {
        if (err) {
            return res.status(500).send('Error on the server.')
        }

        res.status(200).send(products)
    })
})


module.exports = router
