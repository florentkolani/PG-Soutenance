<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="bg-gray-200 w-64 p-4 border-r">
      <div class="flex items-center mb-2">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 rounded-full" style="display: block;" />
        <span class="ml-3 text-xl font-bold">NOVA Lead</span>
      </div>

      <nav class="space-y-4">
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
          <div
          class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
          <div class="text-left">
            <h3 class="text-lg font-semibold">{{ userInfo?.name || 'Utilisateur' }}</h3>
            <p class="text-sm text-gray-600">{{ userInfo?.email || 'Non disponible' }}</p>
          </div>
<!-- Admin Image with Dropdown -->
<div class="relative">
  <!-- "Logout" text at the top -->
  <span class="text-lg font-semibold text-gray-900 text-center block">Logout</span>

  <!-- Admin Image centered at the bottom -->
  <div
    class="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center cursor-pointer mx-auto"
    @click="logout"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 2v10" />
      <path d="M6.35 6.35a8 8 0 1 0 11.3 0" />
    </svg>
  </div>
</div>


    </div>
</header>

<div class="flex space-x-4 p-6 bg-gray-100">
  <div class="bg-white shadow-md rounded-lg p-4 w-1/4 text-center">
    <h4 class="text-lg font-semibold text-gray-700">Total Tickets</h4>
    <p class="text-2xl font-bold text-indigo-500">{{ ticketData.total }}</p>
  </div>
  <div class="bg-white shadow-md rounded-lg p-4 w-1/4 text-center">
    <h4 class="text-lg font-semibold text-gray-700">Ouverts</h4>
    <p class="text-2xl font-bold text-red-500">{{ ticketData.open }}</p>
  </div>
  <div class="bg-white shadow-md rounded-lg p-4 w-1/4 text-center">
    <h4 class="text-lg font-semibold text-gray-700">En Cours</h4>
    <p class="text-2xl font-bold text-blue-500">{{ ticketData.inProgress }}</p>
  </div>
  <div class="bg-white shadow-md rounded-lg p-4 w-1/4 text-center">
    <h4 class="text-lg font-semibold text-gray-700">Résolus</h4>
    <p class="text-2xl font-bold text-yellow-500">{{ ticketData.resolved }}</p>
  </div>
</div>

<!-- Main View with Transition -->
<transition name="fade" mode="out-in">
  <main class="flex-1 p-6 overflow-y-auto bg-gray-50" key="$route.fullPath">
    <router-view />
    <TicketChart :data="[ticketData.open, ticketData.inProgress, ticketData.resolved]" />
  </main>
</transition>

    </div>
  </div>
</template>

<script>
import { getUserRole, getToken } from '@/services/authService';
import AdminModules from '@/components/modules/AdminModules.vue';
import ClientModules from '@/components/modules/ClientModules.vue';
import AgentSupportModules from '@/components/modules/AgentSupportModules.vue';
import TicketChart from '@/views/TicketChart.vue';

export default {
  name: 'Dashboard',
  data() {
  return {
    role: null,
    userInfo: null,
    ticketData: {
      total: 35,
      open: 10,
      inProgress: 5,
      resolved: 20
    },
    showDropdown: false,

  };
},


  async created() {
    this.role = getUserRole();

    const token = getToken();
    if (token) {
      const decoded = jwt_decode(token);

      if (decoded.name && decoded.email) {
        this.userInfo = {
          name: decoded.name,
          email: decoded.email,
        };
      } else {
        // Sinon, récupère les informations via une API (si nécessaire)
        try {
          const userInfo = await fetchUserInfo(decoded.id);
          this.userInfo = userInfo;
        } catch (error) {
          console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
        }
      }
    } else {
      console.error("Token non disponible");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
  },

  
  components: {
    AdminModules,
    ClientModules,
    AgentSupportModules,
    TicketChart
  }
};

async function fetchUserInfo(userId) {
  const token = localStorage.getItem('token'); // Récupère le token depuis le stockage local
  if (!token) {
    console.error("Token manquant, redirection vers la page de connexion");
    throw new Error("Token d'authentification manquant");
  }

  const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Ajoute le token dans les en-têtes
      'Content-Type': 'application/json'
    }
  });

  console.log("Response:", response);
  
  if (!response.ok) {
    console.error("Erreur HTTP:", response.status, response.statusText);
    throw new Error("Échec de la récupération des informations utilisateur");
  }

  return await response.json();
}

</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}

</style>

