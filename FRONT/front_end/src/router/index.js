import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/components/layouts/Dashboard.vue';
import Produits from '../views/Produits.vue';
import Utilisateurs from '../views/Utilisateurs.vue';
import TypesDeDemandes from '../views/TypeDeDemande.vue';
import Tickets from '@/views/tickets.vue';
import LoginView from '@/views/LoginView.vue';
import TicketDetails from '../components/layouts/TicketDetails.vue';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' },
  { path: '/:catchAll(.*)', redirect: '/login' },
  { path: '/Produits', component: Produits },
  { path: '/utilisateurs', component: Utilisateurs },
    { path: '/tickets',    name: 'Tickets',component: Tickets },
  { path: '/TypeDeDemande', component: TypesDeDemandes },
  {path: '/ticket/:ticketId',name: 'TicketDetails',component: TicketDetails,props: true},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard to protect routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
