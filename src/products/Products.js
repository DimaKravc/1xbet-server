let axios = require('axios')

let config = require('../config')

const Products = {
    search (params, callback) {
        axios.get(config['API_HOST'] + 'products/', { params })
            .then(res => {
                const { data } = res

                callback && callback(null, data)
            })
            .catch(err => {
                callback && callback(err)
            })
    },

    delete (params, callback) {
        axios.delete(config['API_HOST'] + 'products/' + params.id)
            .then(res => {
                const { data } = res

                callback && callback(null, data)
            })
            .catch(err => {
                callback && callback(err)
            })
    }
}

module.exports = Products
