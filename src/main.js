import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'materialize-css/dist/css/materialize.css'
import M from 'materialize-css'
import getCookie from './store/functions/cookies'
import components from '@/components/basic/MUI'
import directives from '@/directives'
Vue.prototype.$M = M
Vue.prototype.$getCookie = getCookie
Vue.config.productionTip = false

components.forEach(component => {
    Vue.component(component.name, component)
});
directives.forEach(directive => {
    Vue.directive(directive.name, directive)
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')