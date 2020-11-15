import getCookie from '../functions/cookies'
export default {
    state: {
        status: '',
        token: getCookie('HASHIP'), //getCookie('HASHIP')
        user: getCookie('USER')
    },
    mutations: {},
    actions: {},
    getters: {
        isLoggedIn: state => !!state.token,
        userLogin(state) {
            return state.user
        }
    }
}