<template>
  <div class="flex h-screen">
 <!-- Sidebar -->
  <aside
  :aria-expanded="sidebarVisible"
  :class="[
    'bg-white w-64 p-6 border-r shadow-lg fixed md:relative h-screen z-20 transition-transform duration-300',
    sidebarVisible ? 'translate-x-0' : '-translate-x-full',
    'md:translate-x-0'
  ]"
    >

      <div class="flex items-center mb-8">
        <img src="@/assets/logo.png" alt="Logo" class="h-12 w-12 rounded-lg shadow-md" />
        <span class="ml-3 text-2xl font-bold text-gray-800">NOVA LEAD</span>
      </div>
      <!-- Bouton de fermeture sur petit écran -->
      <button @click="toggleSidebar" class="md:hidden text-gray-700 absolute top-2 right-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <nav class="space-y-2">
        <ul class="space-y-1 list-none p-0">
          <!-- Utiliser filteredModules pour parcourir uniquement les modules autorisés -->
          <li v-for="module in filteredModules" :key="module.name">
            <router-link
            :to="module.route"
            :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
              $route.path === module.route 
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            >
              {{ module.name }}
            </router-link>
          </li>
        </ul>
      </nav>

</aside>
<!-- Main content -->
 <div class="flex-1 flex flex-col">
  <!-- la Navbar -->
   <header class="bg-white shadow-sm pl-10 border-b flex justify-between items-center h-16">
        <span class="text-2xl font-bold text-gray-800">Tableau de bord</span>
        <button @click="toggleSidebar" class="md:hidden p-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div class="flex items-center space-x-6 pr-6">
          <!-- Placeholder for any content you might want to add on the left -->
          <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="text-sm font-medium text-gray-900">{{ userInfo?.name || 'Utilisateur' }}</h3>
            <p class="text-xs text-gray-500">{{ userInfo?.role || 'Utilisateur' }}</p>
          </div>
          <!-- Admin Image with Dropdown -->
          <div class="relative">
            <button
              @click="logout"
              class="flex items-center space-x-2 px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span class="text-sm font-medium text-white">Déconnexion</span>
            </button>
          </div>
        </div>
    </header>

<div class="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 bg-gray-50">
  <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h4 class="text-sm font-medium text-gray-600 mb-2">Total Tickets</h4>
    <p class="text-2xl font-bold text-gray-900">{{ ticketData.total }}</p>
    <div class="h-1 w-full bg-yellow-300 mt-4 rounded-full"></div>
  </div>
  <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h4 class="text-sm font-medium text-gray-600 mb-2">En attente</h4>
    <p class="text-2xl font-bold text-gray-900">{{ ticketData.waiting }}</p>
    <div class="h-1 w-full bg-yellow-500 mt-4 rounded-full"></div>
  </div>
  <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h4 class="text-sm font-medium text-gray-600 mb-2">Ouverts</h4>
    <p class="text-2xl font-bold text-gray-900">{{ ticketData.open }}</p>
    <div class="h-1 w-full bg-blue-500 mt-4 rounded-full"></div>
  </div>
  <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h4 class="text-sm font-medium text-gray-600 mb-2">En Cours</h4>
    <p class="text-2xl font-bold text-gray-900">{{ ticketData.inProgress }}</p>
    <div class="h-1 w-full bg-orange-500 mt-4 rounded-full"></div>
  </div>
  <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h4 class="text-sm font-medium text-gray-600 mb-2">Clôturés</h4>
    <p class="text-2xl font-bold text-gray-900">{{ ticketData.resolved }}</p>
    <div class="h-1 w-full bg-green-500 mt-4 rounded-full"></div>
  </div>
</div>
<!-- Main View with Transition -->
<transition name="fade" mode="out-in">
  <main class="flex-1 p-6 overflow-y-auto bg-gray-50" key="$route.fullPath">
    <router-view />
    <TicketChart :data="[ticketData.waiting, ticketData.open, ticketData.inProgress, ticketData.resolved]" />
  </main>
</transition>

    </div>
  </div>
</template>

<script>
import { getUserRole, getToken } from '@/services/authService';
import AllModule from '@/components/modules/AllModule.vue';
import TicketChart from '@/views/TicketChart.vue';
import { API_URL } from '@/services/config';

export default {
  name: 'Dashboard',
  data() {
    return {
      AllModule: [
        {
          name: 'Utilisateurs',
          route: '/Utilisateurs',
          role: ['Admin'],
        },
        {
          name: 'Produits',
          route: '/produits',
          role: ['Admin', 'AgentSupport'] 
        },
        {
          name: 'Type de demandes',
          route: '/TypeDeDemande',
          role: ['Admin', 'AgentSupport']
        },
        {
          name: 'GestionsPays',
          route: '/GestionsPays',
          role: ['Admin', 'AgentSupport']
        },
         {
           name: 'Notifications',
           route: '/SendEmail',
           role: ['Admin', 'AgentSupport']
         },
        {
          name: 'Tickets',
          route: '/Tickets',
          role: [] 
        },
        {
          name: 'Documents',
          route: '/PdfUploader',
          role: [] 
        },
        {
          name: 'Archives',
          route: '/Archives',
          role: ['Admin', 'AgentSupport'] 
        },
        {
          name: 'À propos',
          route: '/Apropos',
          role: [] 
        }
      ],
      sidebarVisible: false,
      userInfo: null,
      ticketData: {
        total: 0,
        waiting: 0,
        open: 0,
        inProgress: 0,
        resolved: 0
      },
      showDropdown: false,
    };
  },

  computed: {
    filteredModules() {
      return this.AllModule.filter(module => 
        module.role.length === 0 || module.role.includes(this.role)
      );
    }
  },

  async created() {
    try {
        const token = getToken();
        if (!token) {
            console.error("Token non disponible");
            this.$router.push('/login');
            return;
        }

        const decoded = window.jwt_decode(token);

        this.role = decoded.role || getUserRole();
        this.userInfo = {
            name: decoded.name,
            email: decoded.email,
            role: decoded.role || getUserRole(),
            id: decoded.id || decoded._id || decoded.userId // Ajout de plus de fallbacks
        };
        
        if (!this.userInfo.id) {
            console.error("ID utilisateur non trouvé dans le token");
            return;
        }

        await this.fetchTickets();
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
      console.log("État de sidebarVisible :", this.sidebarVisible);
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async fetchTickets() {
        try {
            const token = getToken();
            if (!token) throw new Error('Token non disponible');

            const role = this.role; // Utiliser le rôle stocké dans le composant
            const userId = this.userInfo?.id;

            let url = `${API_URL}/tickets/stats`;
            if (role !== 'Admin' && role !== 'AgentSupport' && userId) {
                url += `/${userId}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la récupération des tickets');
            }

            const stats = await response.json();

            this.ticketData = {
                total: stats.total || 0,
                waiting: stats.waiting || 0,
                open: stats.open || 0,
                inProgress: stats.inProgress || 0,
                resolved: stats.resolved || 0
            };
        } catch (error) {
            console.error('Erreur:', error);
            this.ticketData = {
                total: 0,
                waiting: 0,
                open: 0,
                inProgress: 0,
                resolved: 0
            };
        }
    }
  },

  components: {
    TicketChart,
    AllModule
  }
};

async function fetchUserInfo(userId) {
  const token = localStorage.getItem('token'); // Récupère le token depuis le stockage local
  if (!token) {
    console.error("Token manquant, redirection vers la page de connexion");
    throw new Error("Token d'authentification manquant");
  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
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

