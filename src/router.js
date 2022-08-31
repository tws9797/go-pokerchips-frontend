import { createWebHistory, createRouter } from 'vue-router';

const routes = [
    {
        path: "/",
        name: "createRoom",
        component: () => import("./components/CreateRoom")
    },
    {
        path: "/join",
        name: "joinRoom",
        component: () => import("./components/JoinRoom")
    },
    {
        path: "/join/:id",
        name: "inRoom",
        component: () => import("./components/InRoom")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;