import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue'),
        meta: {
            requiresAuth: true
        },
        children: [{
                path: 'view',
                component: () =>
                    import ('../components/forum/ViewTopic.vue')
            },
            {
                path: 'view/:id',
                component: () =>
                    import ('../components/forum/ViewTopic.vue')
            },
        ]
    },
    {
        path: '/forum',
        name: 'Forums',
        component: () =>
            import ('../views/Forum.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/mvideo',
        name: 'Mvideo',
        component: () =>
            import ('../views/Mvideo.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/games',
        name: 'Games',
        component: () =>
            import ('../views/Games.vue'),
    },
    {
        path: '/games/platform',
        name: 'GamePlatform',
        component: () =>
            import ('../components/games/GamePlatform.vue'),
    },
    {
        path: '/games/mario',
        name: 'Mario',
        component: () =>
            import ('../views/Mario.vue'),
    },
    {
        path: '/games/trassa',
        name: 'Trassa',
        component: () =>
            import ('../components/games/Trassa.vue'),
    },
    {
        path: '/privatechats',
        name: 'PrivateChat',
        component: () =>
            import ('../components/forum/Users/PrivateChats.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/profile/:id',
        name: 'UserProfile',
        component: () =>
            import ('../components/forum/Users/Profile.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/users/:id',
        name: 'UserProfile',
        component: () =>
            import ('../components/forum/Users/Profile.vue'),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/forum/:id',
        name: 'Forum',
        component: () =>
            import ('../views/Forum.vue'),
        children: [{
            path: 'view',
            component: () =>
                import ('../views/Topic.vue')
        }]
    },
    {
        path: '/users',
        name: 'Users',
        component: () =>
            import ('../views/Users.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: () =>
            import ('../views/Gallery.vue'),
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/billing',
        name: 'Billing',
        component: () =>
            import ('../views/Billing.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('@/components/Login.vue')
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () =>
            import ('../views/Adminka.vue'),
        children: [{
                // при совпадении пути с шаблоном /user/:id/profile
                // в <router-view> компонента User будет показан UserProfile
                path: 'security',
                component: () =>
                    import ('../views/Users.vue')
            },
            {
                // при совпадении пути с шаблоном /user/:id/posts
                // в <router-view> компонента User будет показан UserPosts
                path: 'querysetting',
                component: () =>
                    import ('../views/QuerrySetting.vue')
            },
            {
                // при совпадении пути с шаблоном /user/:id/posts
                // в <router-view> компонента User будет показан UserPosts
                path: 'querysettingpg',
                component: () =>
                    import ('@/components/adminka/QuerrySetting.vue')
            },
            {
                // при совпадении пути с шаблоном /user/:id/posts
                // в <router-view> компонента User будет показан UserPosts
                path: 'bdtables',
                component: () =>
                    import ('@/components/adminka/BaseTable.vue')
            },
            {
                // при совпадении пути с шаблоном /user/:id/posts
                // в <router-view> компонента User будет показан UserPosts
                path: 'tables',
                component: () =>
                    import ('@/components/adminka/Tables.vue')
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
import store from '../store'
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next()
            return
        }
        next('/login')
    } else {
        next()
    }
})

export default router