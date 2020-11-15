// import getCookie from './functions/cookies'
export default {
    state: {
        sqlQuery: []
    },
    mutations: {},
    actions: {},
    getters: {
        sqlQuery(state) {
            let object = state.sqlQuery
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    object[key].need_token = +object[key].need_token
                }
            }
            return object
        }
    }
}