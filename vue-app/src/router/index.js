import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Paste from '../views/Paste.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'New paste',
    component: Home,
  },
  {
    path: '/browse',
    name: 'Browse',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Browse.vue'),
  },
  {
    path: '/paste/:id', 
    name: 'Paste',
    component: Paste, 
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
