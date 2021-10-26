export default {
    namespaced: true,
    state: {
        posts: [],
        forums: [],
        themes: [],
        page: 1,
        limit: 20,
        users: [],
        chats: [],
        inchats: [],
        outchats: [],
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