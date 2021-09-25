import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        notifyInfo: [],
        isAdmin: false,
    },
    mutations: {
        setNotifyInfo(state, payload) {
            state.notifyInfo = payload;
        },
        setAdmin(state, payload) {
            state.isAdmin = payload;
        },
    },
    getters: {
        getNotifyInfo: (state) => {
            return state.notifyInfo;
        },
        isAdmin: (state) => {
            return state.isAdmin;
        },
    },
});
