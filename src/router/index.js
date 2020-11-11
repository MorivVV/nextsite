import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue')
    },
    {
        path: '/forum',
        name: 'Forum',
        component: () =>
            import ('../views/Forum.vue')
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
            import ('../views/Adminka.vue')
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