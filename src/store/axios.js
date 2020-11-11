const axios = require('axios')
export default axios.create({
    baseURL: (process.env.NODE_ENV === "development") ? 'http://nextsite.com:8080/' : '/'
})