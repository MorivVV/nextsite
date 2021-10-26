import getCookie from '../functions/cookies'
export default {
    state: {
        status: '',
        token: getCookie('HASHIP'), //getCookie('HASHIP')
        user: getCookie('USER'),
        kod_user: getCookie('kod_user') || 0
    },
    mutations: {},
    actions: {},
    getters: {
        isLoggedIn: state => !!state.token,
        token: state => state.token,
        userId: state => state.kod_user,
        userLogin(state) {
            return state.user
        }
    }
}