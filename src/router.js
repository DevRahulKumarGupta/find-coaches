import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import store from './store/index';
// // import CoachDetail from './pages/coaches/CoachDetail.vue';
// // import CoachesList from './pages/coaches/CoachesList.vue';
// // import CoachRegistation from './pages/coaches/CoachRegistration.vue';
// // import ContactCoach from './pages/requests/ContactCoach.vue';
// // import RequestsReceived from './pages/requests/RequestsReceived.vue';
// // import NotFound from './pages/NotFound.vue';
// // import UserAuth from './pages/Auth/UserAuth.vue';


const CoachDetail = defineAsyncComponent(() => import('./pages/coaches/CoachDetail.vue'));
const CoachesList = defineAsyncComponent(() => import('./pages/coaches/CoachesList.vue'));
const CoachRegistation = defineAsyncComponent(() => import('./pages/coaches/CoachRegistration.vue'));
const ContactCoach = defineAsyncComponent(() => import('./pages/requests/ContactCoach.vue'));
const RequestsReceived = defineAsyncComponent(() => import('./pages/requests/RequestsReceived.vue'));
const NotFound = defineAsyncComponent(() => import('./pages/NotFound.vue'));
const UserAuth = defineAsyncComponent(() => import('./pages/Auth/UserAuth.vue'));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: CoachDetail,
      props: true,
      children: [
        { path: 'contact', component: ContactCoach }, // /coaches/c1/contact
      ],
    },
    { path: '/register', component: CoachRegistation, meta: { requiresAuth: true } },
    { path: '/requests', component: RequestsReceived, meta: { requiresAuth: true } },
    { path: '/auth', component: UserAuth, meta: { requiresUnauth: true } },
    { path: '/:notFound(.*)', component: NotFound },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthincated) {
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters.isAuthincated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
