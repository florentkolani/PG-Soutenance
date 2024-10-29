<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="bg-gray-200 w-64 p-4 border-r">
      <div class="flex items-center mb-2">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 rounded-full" style="display: block;" />
        <span class="ml-3 text-xl font-bold">NOVA Lead</span>
      </div>

      <nav class="space-y-4">
        <!-- Lien pour les différentes sections du menu selon le rôle -->
        <li v-if="role === 'Admin'">
          <AdminModules />
        </li>
        <li v-if="role === 'Client'">
          <ClientModules />
        </li>
        <li v-if="role === 'AgentSupport'">
          <AgentSupportModules />
        </li>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- la Navbar -->
      <header class="bg-gray-100 p-2 border-b flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <!-- Placeholder for any content you might want to add on the left -->
        </div>
        <div class="flex items-center space-x-4">
          <!-- User Welcome and Info moved to the right -->
          <div class="text-right">
            <h3 class="text-lg font-semibold">Bienvenue, {{ userInfo?.name || 'Utilisateur' }}</h3>
            <p class="text-sm text-gray-600">Email : {{ userInfo?.email || 'Non disponible' }}</p>
          </div>
          <!-- Logo at the end -->
          <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 rounded-full" />
        </div>
      </header>
<!-- Main View with Transition -->
      <transition name="fade" mode="out-in">
        <main class="flex-1 p-6 overflow-y-auto bg-gray-50" key="$route.fullPath">
          <router-view />
          <!-- Affichage du graphique -->
          <TicketChart :data="[10, 5, 20]" />
        </main>
      </transition>
    </div>
  </div>
</template>

<script>
import { getUserRole, getUserInfo } from '@/services/authService';
import AdminModules from '@/components/modules/AdminModules.vue';
import ClientModules from '@/components/modules/ClientModules.vue';
import AgentSupportModules from '@/components/modules/AgentSupportModules.vue';
import TicketChart from '@/views/TicketChart.vue';

export default {
  name: 'Dashboard',
  data() {
    return {
      role: null,
      userInfo: null, // Contiendra les informations de l'utilisateur
    };
  },

  created() {
    // Récupération du rôle de l'utilisateur
    this.role = getUserRole();

    // Récupération des informations de l'utilisateur
    const userInfo = getUserInfo();
    if (userInfo) {
      this.userInfo = userInfo;
    } else {
      console.error("Les informations de l'utilisateur n'ont pas pu être récupérées.");
    }
  },
  
  components: {
    AdminModules,
    ClientModules,
    AgentSupportModules,
    TicketChart
  }
};
</script>

<style scoped>
/* Animation de fondu pour les transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

</style>
