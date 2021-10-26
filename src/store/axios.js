const axios = require('axios')
import getCookie from './functions/cookies'
const ax = axios.create({
    baseURL: (process.env.NODE_ENV === "development") ? 'http://192.168.1.36:80/' : '/'
})
let token = getCookie('HASHIP')
if (token) {
    console.log('token=', token);
    ax.defaults.headers.post['V-Token'] = token;
}

export default ax;