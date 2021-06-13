import Vue from "vue";
import VueRouter from "vue-router";
import { logout, auth } from "../src/plugins/firebase";

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
        path: "/Main",
        name: "Main",
        component: () => import("./pages/main.vue"),
        children: [
            {
                path: "/",
                name: "Dashboard",
                component: () => import("./pages/Dashboard.vue"),
            },
            {
                path: "/RecordScore",
                name: "RecordScore",
                component: () => import("./pages/RecordScore.vue"),
            },
            {
                path: "/Profile",
                name: "Profile",
                component: () => import("./pages/Profile.vue"),
            },
            {
                path: "/Feedback",
                name: "Feedback",
                component: () => import("./pages/Feedback.vue"),
            },
            {
                path: "/Logout",
                name: "Logout",
                component: () => import("./pages/Top.vue"),
                meta: { isPublic: true },
                beforeEnter: async function(to, from, next) {
                    await logout();
                    next({ path: "/" });
                },
            },
        ],
    },
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

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => !record.meta.isPublic)) {
        await auth.onAuthStateChanged(function(user) {
            if (user) {
                next();
            } else {
                next({ path: "/" });
            }
        });
    } else {
        await auth.onAuthStateChanged(function(user) {
            if (user) {
                next({ path: "/Main" });
            } else {
                next();
            }
        });
    }
});

export default router;
