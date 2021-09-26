import Vue from "vue";
import VueRouter from "vue-router";
import { auth, RAMEN } from "./plugins/firebase";

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
        name: "OshiAniTop",
        component: () => import("./pages/OshiAniTop.vue"),
        meta: { isPublic: true },
    },
    {
        path: "/WorkInfoList/year/:year/season/:season",
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
        meta: { isPublic: true, requireAuth: true },
    },
    {
        path: "/WatchList",
        name: "WatchList",
        component: () => import("./pages/WatchList.vue"),
        meta: { isPublic: true, requireAuth: true },
    },
    {
        path: "/PostArticle",
        name: "PostArticle",
        component: () => import("./pages/PostArticle.vue"),
        meta: { isPublic: true, requireAuth: true, onlyAdmin: true },
    },
    {
        path: "/Information",
        name: "Information",
        component: () => import("./pages/Information.vue"),
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
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    },
});

//かなりハマった。↓の記事が参考になった。
//https://zenn.dev/phi/articles/firebase-auth-wait-for-initialization
router.beforeEach((to, from, next) => {
    const requiresOnlyAdmin = to.matched.some(
        (record) => record.meta.onlyAdmin
    );
    const requiresAuth = to.matched.some((record) => record.meta.requireAuth);
    auth.onAuthStateChanged((user) => {
        const currentUser = user;
        //reAuth(currentUser.uid);
        if (requiresOnlyAdmin) {
            if (currentUser === null || currentUser.uid !== RAMEN) {
                next({
                    path: "/",
                    query: { redirect: to.fullPath },
                });
            } else {
                next();
            }
        } else if (requiresAuth) {
            if (!currentUser) {
                next({
                    path: "/",
                    query: { redirect: to.fullPath },
                });
            } else {
                next();
            }
        } else {
            next();
        }
    });
});

export default router;
