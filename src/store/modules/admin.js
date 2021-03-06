// import getCookie from './functions/cookies'
export default {
    namespaced: true,
    state: {
        addQuery: [],
        search: "",
        searchCount: 0,
        resultMin: 0,
        perPage: 10,
        sqlQuery: [],
        dataTypes: [],
        update: '',
        tables: [],
        tableFields: [],
        tableList: [],
        tanksMaps: [],
        gameObjects: [],
        fieldList: [],
        pg_namespace: [],
        primarykey: [],
        dataTable: [],
        tableData: []
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