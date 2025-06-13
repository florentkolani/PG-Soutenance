<template>
  <div class="bg-gray-100 min-h-screen">
    <Header title="NOVA LEAD" @primaryAction="showModal = true" @filterChanged="onFilterChanged"
      @goToDashboard="redirectToDashboard" :filterAction="true" :filterOptions="userFilterOptions" />

    <main class="w-full px-4 py-3">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Liste des Utilisateurs Archivés</h1>
      </div>

      <!-- Table des utilisateurs archivés -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="py-3 px-6 text-left">Nom</th>
              <th class="py-3 px-6 text-left">Email</th>
              <th class="py-3 px-6 text-left">Contact</th>
              <th class="py-3 px-6 text-left">Rôle</th>
              <th class="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="user in filteredUsers" :key="user._id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="py-3 px-6 text-left">{{ user.name }}</td>
              <td class="py-3 px-6 text-left">{{ user.email }}</td>
              <td class="py-3 px-6 text-left">{{ user.contact }}</td>
              <td class="py-3 px-6 text-left">{{ user.role }}</td>

              <td class="py-3 px-6 text-center">
                <button @click="viewDetails(user)"
                  class="bg-green-500 text-white px-4 py-2 rounded mr-2">Détails</button>
                <button @click="unarchiveUser(user)"
                  class="bg-blue-500 text-white px-4 py-2 rounded">Désarchiver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de détails -->
      <div v-if="showDetailsModal"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <h2 class="text-xl font-bold mb-6 text-center">Détails de l'utilisateur</h2>
          <div class="text-left space-y-2 pl-4">
            <p><strong>Nom :</strong> <span class="ml-2">{{ selectedUser.name }}</span></p>
            <p><strong>Email :</strong> <span class="ml-2">{{ selectedUser.email }}</span></p>
            <p><strong>Contact :</strong> <span class="ml-2">{{ selectedUser.contact }}</span></p>
            <p><strong>Rôle :</strong> <span class="ml-2">{{ selectedUser.role }}</span></p>
            <p><strong>Pays :</strong> <span class="ml-2">{{ selectedUser.pays }}</span></p>
            <p><strong>Ville :</strong> <span class="ml-2">{{ selectedUser.ville }}</span></p>
          </div>
          <button @click="closeDetailsModal"
            class="mt-6 bg-green-500 text-white px-4 py-2 rounded mx-auto block">Fermer</button>
        </div>
      </div>

      <!-- Modal de confirmation de désarchivage -->
      <div v-if="showUnarchiveModal"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-enter p-4">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <svg class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p class="text-center">Êtes-vous sûr de vouloir désarchiver cet utilisateur?</p>
          <div class="flex justify-center mt-4">
            <button @click="confirmUnarchive" 
              class="bg-red-500 text-white px-4 py-2 rounded mr-2 flex items-center justify-center"
              :disabled="isLoading">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Désarchivage en cours...' : 'Oui, désarchiver' }}
            </button>
            <button @click="closeUnarchiveModal" 
              class="bg-gray-500 text-white px-4 py-2 rounded"
              :disabled="isLoading">Annuler</button>
          </div>
        </div>
      </div>
    </main>

    <!-- Pagination -->
    <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />
  </div>
</template>

<script>
import axios from 'axios';
import Pagination from '@/components/layouts/Pagination.vue';
import Header from '@/components/layouts/Header.vue';
import GoToDashboard from '@/components/layouts/GoToDashboard.vue';
import { API_URL } from '@/services/config';

export default {
  name: 'ArchivedUsers',
  components: {
    Pagination,
    Header,
    GoToDashboard,
  },
  data() {
    return {
      users: [],
      userFilterOptions: [
        { value: '', label: 'Tous' },
        { value: 'Admin', label: 'Admin' },
        { value: 'Client', label: 'Client' },
        { value: 'AgentSupport', label: 'Agent' },
      ],
      selectedRole: '',
      filterRole: '',
      selectedUser: null,
      showDetailsModal: false,
      showUnarchiveModal: false,
      selectedUserId: null,
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    };
  },

  computed: {
    filteredUsers() {
      if (this.selectedRole === '') {
        return this.users;
      }
      return this.users.filter(user => user.role === this.selectedRole);
    },

  },
  methods: {
    redirectToDashboard() {
      this.$router.push('/dashboard'); // Redirection vers la route du dashboard
    },
    getToken() {
      return localStorage.getItem('token');
    },
    checkAuthorization() {
      const token = this.getToken();
      if (!token) {
        console.error("Token manquant. Redirection vers la page de connexion.");
        this.$router.push('/login');
        return false;
      }
      return token;
    },
    fetchArchivedUsers(page = this.currentPage, limit = this.itemsPerPage) {
      const token = this.checkAuthorization();
      if (!token) return;

      axios.get(`${API_URL}/users/archived`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          limit: limit,
        }
      })
        .then(response => {
          this.users = response.data.data;
          this.totalItems = response.data.totalItems;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        })
        .catch(error => {
          console.error('Error fetching archived users:', error);
        });
    },
    onFilterChanged(role) {
      this.selectedRole = role;
    },

    viewDetails(user) {
      this.selectedUser = user;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.selectedUser = null;
      this.showDetailsModal = false;
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.fetchArchivedUsers(page, this.itemsPerPage);
    },
    unarchiveUser(user) {
      this.selectedUserId = user._id;
      this.showUnarchiveModal = true;
    },
    closeUnarchiveModal() {
      this.showUnarchiveModal = false;
      this.selectedUserId = null;
      this.isLoading = false;
    },
    async confirmUnarchive() {
      if (!this.selectedUserId) return;

      this.isLoading = true;
      const token = this.checkAuthorization();
      if (!token) {
        this.closeUnarchiveModal();
        return;
      }

      try {
        await axios.put(`${API_URL}/users/${this.selectedUserId}/unarchive`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Rafraîchir la liste des utilisateurs archivés
        await this.fetchArchivedUsers();
        
        // Fermer le modal
        this.closeUnarchiveModal();
      } catch (error) {
        console.error('Error unarchiving user:', error);
        this.closeUnarchiveModal();
      }
    },
  },
  mounted() {
    this.fetchArchivedUsers();
  },
};
</script>