<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside :aria-expanded="sidebarVisible" :class="[
      'bg-white w-64 p-6 border-r shadow-lg fixed md:relative h-screen z-20 transition-transform duration-300',
      sidebarVisible ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0'
    ]">

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
            <router-link :to="module.route" :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
              $route.path === module.route
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]">
              <!-- Icons for each module -->
              <svg v-if="module.name === 'Utilisateurs'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else-if="module.name === 'Produits'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <svg v-else-if="module.name === 'Type de demandes'" xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <svg v-else-if="module.name === 'GestionsPays'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="module.name === 'Notifications'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <svg v-else-if="module.name === 'Tickets'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <svg v-else-if="module.name === 'Documents'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else-if="module.name === 'Archives'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <svg v-else-if="module.name === 'Reporting'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <svg v-else-if="module.name === 'À propos'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="module.name === 'Tâches'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
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

        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="md:hidden p-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="text-2xl font-bold text-gray-800">Tableau de bord</span>

        </div>
        <div class="flex items-center space-x-6 pr-6">
          <!-- Admin Image with Dropdown -->
          <div class="relative">
            <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <!-- Visible only on large screens -->
              <div class="hidden md:block text-left">
                <h3 class="text-sm font-medium text-gray-900">{{ userInfo?.name || 'Utilisateur' }}</h3>
                <p class="text-xs text-gray-500">{{ userInfo?.role || 'Utilisateur' }}</p>
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <!-- User Info in Dropdown -->
              <div class="px-4 py-2 border-b">
                <h3 class="text-sm font-medium text-gray-900">{{ userInfo?.name || 'Utilisateur' }}</h3>
                <p class="text-xs text-gray-500">{{ userInfo?.role || 'Utilisateur' }}</p>
              </div>

              <!-- Logout Button -->
              <button @click="logout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
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
          name: 'Tâches',
          route: '/Tasks',
          role: ['Admin', 'AgentSupport']
        },
        {
          name: 'Reporting',
          route: '/Reporting',
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
      this.showDropdown = false;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Add click outside handler */
.dropdown-container {
  position: relative;
}

/* Add transition for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
