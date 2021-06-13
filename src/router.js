import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const getRoutes = () => {
    const isError = false;
    if (isError) {
        return menteRoutes;
    }
    return greenRoutes;
};

const menteRoutes = [
    {
        path: "*",
        name: "Error",
        component: () => import("./pages/Error.vue"),
        meta: { isPublic: true },
    },
];

const greenRoutes = [
    {
        path: "/",
        name: "Top",
        component: () => import("./pages/Top.vue"),
        meta: { isPublic: true },
    },
];

const routes = getRoutes();

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
