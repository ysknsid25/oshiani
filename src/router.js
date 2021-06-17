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
        name: "WorkInfoList",
        component: () => import("./components/WorkInfoList.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/Profile",
        name: "Profile",
        component: () => import("./pages/Profile.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/About",
        name: "About",
        component: () => import("./pages/About.vue"),
        meta: { isPublic: true },
    },
    {
        path: "*",
        name: "NotFound",
        component: () => import("./pages/NotFound.vue"),
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
