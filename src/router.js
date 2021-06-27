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
        component: () => import("./pages/WorkInfoList.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/Blog",
        name: "Blog",
        component: () => import("./pages/Blog.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/Article/:articleId",
        name: "Article",
        component: () => import("./pages/Article.vue"),
        props: true,
        meta: { isPublic: true },
    },
    {
        path: "/OshiAni",
        name: "OshiAni",
        component: () => import("./pages/OshiAni.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/Logout",
        name: "Logout",
        component: () => import("./pages/WorkInfoList.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/Profile",
        name: "Profile",
        component: () => import("./pages/Profile.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/WatchList",
        name: "WatchList",
        component: () => import("./pages/WatchList.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/PostArticle",
        name: "PostArticle",
        component: () => import("./pages/PostArticle.vue"),
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
