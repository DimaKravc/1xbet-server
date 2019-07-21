let axios = require('axios')

let config = require('../config')

const User = {
    create (data, callback) {
        axios.post(config['API_HOST'] + 'users/', data)
            .then(res => {
                const { data } = res

                callback && callback(null, data)
            })
            .catch(err => {
                callback && callback(err)
            })
    },

    search (callback) {
        axios.get(config['API_HOST'] + 'users/')
            .then(res => {
                const { data } = res

                callback && callback(null, data)
            })
            .catch(err => {
                callback && callback(err)
            })
    },

    searchByEmail (email, callback) {
        axios.get(config['API_HOST'] + 'users/', {
            params: {
                search: email,
                order: 'asc'
            }
        })
            .then(res => {
                const { data } = res

                if (data.length) {
                    callback && callback(null, data[0])
                } else {
                    callback && callback(null, null)
                }
            })
            .catch(err => {
                callback && callback(err)
            })
    },

    searchById (id, callback) {
        axios.get(config['API_HOST'] + 'users/' + id)
            .then(res => {
                const { data } = res

                callback && callback(null, data)
            })
            .catch(err => {
                callback && callback(err)
            })
    },

    searchByIdAndUpdate (id, data, callback) {
        axios.put(config['API_HOST'] + 'users/' + id, data)
            .then(res => {
                const { data } = res

                callback && callback(null, data)
            })
            .catch(err => {
                callback && callback(err)
            })
    }
}

module.exports = User
