let express = require('express')
let cors = require('cors')
const PORT = process.env.PORT || 8080

let AuthController = require('./auth/AuthController')
let UserController = require('./user/UserController')
let ProductsController = require('./products/ProductsController')

let app = express()

app.use(cors())

app.use('/api/auth/', AuthController)
app.use('/api/user/', UserController)
app.use('/api/products/', ProductsController)

app.listen(PORT, () => console.log('\x1b[33m', `Running on localhost:${PORT}`, '\x1b[0m'))
