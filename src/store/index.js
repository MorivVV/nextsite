import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios'
import shifr from './functions/shifr'


Vue.use(Vuex)
import billing from './modules/billing'
import forum from './modules/forum'
import autorization from './modules/autorization'
import admin from './modules/admin'
import games from './modules/games'
import gallery from './modules/gallery'
import mvideo from './modules/mvideo'
export default new Vuex.Store({
    state: {},
    mutations: {
        updateState(state, data) {
            let module = data.state.split('/')
            switch (module.length) {
                case 1:
                    state[module[0]] = data.data
                    break;
                case 2:
                    state[module[0]][module[1]] = data.data
                    break;
                case 3:
                    state[module[0]][module[1]][module[2]] = data.data
                    break;
                case 4:
                    state[module[0]][module[1]][module[2]][module[3]] = data.data
                    break;
                case 5:
                    state[module[0]][module[1]][module[2]][module[3]][module[4]] = data.data
                    break;
                default:
                    break;
            }
        }
    },
    actions: {
        fetchData({ commit, rootGetters }, param) {
            let data = param.data
            let url = '/ajax/getAxios.php'
            let opt = {
                headers: {
                    post: {
                        "V-Token": rootGetters.token
                    }
                }
            }
            if (typeof param['url'] !== "undefined") {
                url = param.url
            }
            return axios.post(url, data, opt)
                .then(res => {
                    if ("stateName" in param) {
                        if (res.data === "Нет авторизации") {
                            res.data = []
                        }
                        commit('updateState', { state: param.stateName, data: res.data })
                    }
                    return res.data;
                })
        },
        authorizate({ commit }, param) {
            return new Promise((resolve, reject) => {
                let url = '/ajax/autorizator.php'
                let data = new FormData()
                data.append('login', param.login)
                axios.post(url, data)
                    .then(res => {
                        let pass = param.password
                        console.log(pass)
                        console.log(shifr(res.data, pass))
                        data.append('answer', shifr(res.data, pass))
                        return axios.post(url, data)
                    })
                    .then(res => {
                        if (res.data !== 'password not authorized!!!') {
                            axios.defaults.headers.post['V-Token'] = res.data.token;
                            commit('updateState', { state: 'autorization/user', data: res.data.user })
                            commit('updateState', { state: 'autorization/token', data: res.data.token })
                            commit('updateState', { state: 'autorization/kod_user', data: res.data.kod_user })
                            resolve(res)
                        } else {
                            reject(res)
                        }

                    })
                    .catch(err => {
                        // commit('auth_error')
                        // localStorage.removeItem('token')
                        reject(err)
                    })
            })
        }
    },
    modules: {
        forum,
        autorization,
        billing,
        admin,
        games,
        mvideo,
        gallery
    }
})