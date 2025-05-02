import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/components/layouts/Dashboard.vue';
import Produits from '../views/Produits.vue';
import Utilisateurs from '../views/Utilisateurs.vue';
import TypesDeDemandes from '../views/TypeDeDemande.vue';
import Tickets from '@/views/tickets.vue';
import LoginView from '@/views/LoginView.vue';
import TicketDetails from '../components/layouts/TicketDetails.vue';
import ChangePassword from '@/views/ChangePassword.vue'
import ForgotPassword from '../views/ForgotPassword.vue';
import PdfUploader from '../views/PdfUploader.vue';
import GestionsPays from '../views/GestionsPays.vue';
import GestionsVille from '@/views/GestionsVille.vue';
import Apropos from '@/views/Apropos.vue';
import VideoUploader from '@/views/VideoUploader.vue';
import sendEmail from '@/views/sendEmail.vue';
import Reporting from '../views/Reporting.vue';
import Tasks from '../views/Tasks.vue';
import TaskDetails from '@/components/layouts/TaskDetails.vue';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' },
  { path: '/:catchAll(.*)', redirect: '/login' },
  { path: '/Produits', name: 'Produits', component: Produits },
  { path: '/utilisateurs', name: 'Utilisateurs', component: Utilisateurs },
  { path: '/tickets', name: 'Tickets', component: Tickets },
  { path: '/TypeDeDemande', name: 'TypeDeDemande', component: TypesDeDemandes },
  { path: '/ticket/:ticketId', name: 'TicketDetails', component: TicketDetails, props: true },
  { path: '/Archives', name: 'Archives', component: () => import('@/views/Archives.vue'), meta: { requiresAuth: true } },
  { path: '/ChangePassword', name: 'ChangePassword', component: ChangePassword },
  { path: '/PdfUploader', name: 'PdfUploader', component: PdfUploader },
  { path: '/ForgotPassword', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/GestionsPays', name: 'GestionsPays', component: GestionsPays },
  { path: '/Apropos', name: 'Apropos', component: Apropos },
  { path: '/videos', name: 'VideoUploader', component: VideoUploader },
  { path: '/gestionsville', name: 'GestionsVille', component: GestionsVille },
  { path: '/sendEmail', name: 'sendEmail', component: sendEmail },
  { path: '/Reporting', name: 'Reporting', component: Reporting },
  { path: '/Tasks', name: 'Tasks', component: Tasks },
  { path: '/tasks/:id', name: 'TaskDetails', component: TaskDetails, props: true }];

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
