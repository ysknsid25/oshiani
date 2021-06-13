import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./registerServiceWorker";
import "@fortawesome/fontawesome-free/css/all.css";
import router from "./router";
import store from "./plugins/store";
import { anl } from "./plugins/firebase";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.config.productionTip = false;
Vue.prototype.$analytics = anl;
Vue.use(VueAxios, axios);

new Vue({
    store,
    router,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
