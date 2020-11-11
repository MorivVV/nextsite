export default {
    state: {
        posts: [],
        forums: [],
        users: [],
        ranks: [],
    },
    mutations: {},
    actions: {},
    getters: {
        postList(state) {
            return state.posts
        },
        forumList(state) {
            return state.forums
        },
        userList(state) {
            return state.users
        },
        rankList(state) {
            return state.ranks
        },
    }
}