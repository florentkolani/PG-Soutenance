<template>
  <div class="bg-gray-100 min-h-screen">
    
    <Header 
      title="NOVA LEAD" 
      primaryActionText="Nouvel utilisateur" 
      @primaryAction="showModal = true" 
      @filterChanged="onFilterChanged"
       @goToDashboard="redirectToDashboard"
      :filterAction="true" 
      :filterOptions="userFilterOptions" 
    />

    <main class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Liste des utilisateurs</h1>
      </div>

      <!-- Table des utilisateurs -->
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6 text-left">Nom</th>
            <th class="py-3 px-6 text-left">Email</th>
            <th class="py-3 px-6 text-left">Contact</th>
            <th class="py-3 px-6 text-left">Rôle</th>
            <th class="py-3 px-6 text-left">Date de création</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="user in filteredUsers" :key="user._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left">{{ user.name }}</td>
            <td class="py-3 px-6 text-left">{{ user.email }}</td>
            <td class="py-3 px-6 text-left">{{ user.contact }}</td>
            <td class="py-3 px-6 text-left">{{ user.role }}</td>
            <td class="border px-4 py-2 text-center">
              {{ new Date(user.createdAt).toLocaleString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
              }) }}
            </td>
            
            <td class="py-3 px-6 text-center">
              <button @click="viewDetails(user)" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Détails</button>
              <button @click="openEditModal(user)" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Modifier</button>
              <button @click="openArchiveModal(user._id)" class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Archiver</button>
            </td> 
            
          </tr>
        </tbody>
      </table>

      <!-- Modal d'enregistrement/modification d'utilisateur -->
      <UserModal 
        v-if="showModal" 
        :userToEdit="editUserData"
        @close="closeUserModal" 
        @user-updated="onUserUpdated"
      />

      <!-- Modal de détails -->
      <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-2/3">
          <h2 class="text-xl font-bold mb-6 text-center">Détails de l'utilisateur</h2>
          <table class="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-200 text-left">
                <th class="border border-gray-300 px-4 py-2">Champ</th>
                <th class="border border-gray-300 px-4 py-2">Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Nom</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedUser.name }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Email</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedUser.email }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Contact</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedUser.contact }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Rôle</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedUser.role }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Pays</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedUser.pays }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Ville</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedUser.ville }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-center mt-6">
            <button @click="closeDetailsModal" class="bg-green-500 text-white px-4 py-2 rounded-md">Fermer</button>
          </div>
        </div>
      </div>

      <!-- Confirmation d'archivage -->
      <div v-if="showArchiveModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-enter">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <svg class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
          <p>Êtes-vous sûr de vouloir archiver cet utilisateur?</p>
          <div class="flex justify-center mt-4">
            <button @click="archiveUser(selectedUserId)" class="bg-red-500 text-white px-4 py-2 rounded mr-2">Oui, archiver</button>
            <button @click="closeArchiveModal" class="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    </main>
    <!-- Modal d'alerte -->
    <div v-if="showAlertModal" class="fixed inset-0 z-[60] bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <div :class="['text-6xl mb-4 text-center', alert.type === 'success' ? 'text-green-500' : 'text-red-500']">
          <i :class="alert.type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        </div>
        <p class="text-center text-xl mb-4">{{ alert.message }}</p>
        <div class="flex justify-center">
          <button @click="showAlertModal = false" class="mt-4 bg-gray-500 text-white px-4 py-2 rounded">Fermer</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Pagination -->
<Pagination
        :total-items="totalItems" 
        :items-per-page="itemsPerPage" 
        @page-changed="goToPage" 
      />
</template>


<script>
import axios from 'axios';
import UserModal from '@/components/layouts/UserModal.vue';
import Pagination from '@/components/layouts/Pagination.vue'; 
import Header from '@/components/layouts/Header.vue';
import GoToDashboard from '@/components/layouts/GoToDashboard.vue';
import { API_URL } from '@/services/config';

export default {
  name: 'Utilisateurs',
  components: {
    UserModal,
    Pagination,
    Header,
    GoToDashboard
  },
  data() {
    return {
      showModal: false,
      showEditModal: false,
      showDetailsModal: false,
      showArchiveModal: false,
      dropdownOpen: null,
      users: [],
      selectedRole: '',
      userFilterOptions: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Client', label: 'Client' },
        { value: 'AgentSupport', label: 'Agent' },
      ],
      filterRole: '',
      selectedUser: null,
      selectedUserId: null,
      showFilterDropdown: false,
      editUserData: null,
      alert: { message: '', type: '' },
      showAlertModal: false,
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

    toggleDropdown(userId) {
    this.dropdownOpen = this.dropdownOpen === userId ? null : userId;
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

    fetchUsers(page = this.currentPage, limit = this.itemsPerPage) {
      const token = this.checkAuthorization();
      if (!token) return;

      axios.get(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          limit: limit,
        }
      })
      .then(response => {
        // Filtrer les utilisateurs non archivés
        const nonArchivedUsers = response.data.data.filter(user => !user.isArchived);

        // Trier les utilisateurs par ordre alphabétique (en fonction du nom)
        const sortedUsers = nonArchivedUsers.sort((a, b) => {
          const nameA = (a.name ?? '').toUpperCase(); 
          const nameB = (b.name ?? '').toUpperCase(); 
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        // Assigner les utilisateurs triés
        this.users = sortedUsers;

        // Mettre à jour la pagination
        this.pagination = {
          currentPage: response.data.currentPage,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
          itemsPerPage: limit,
        };
      })
      .catch(error => {
        console.error('Erreur de chargement des Utilisateurs:', error);
      });
    },
    onFilterChanged(role) {
      this.selectedRole = role;
    },

    openEditModal(user) {
      this.editUserData = { ...user };
      this.showModal = true;
    },
    closeEditModal() {
      this.editUserData = null;
      this.showEditModal = false;
    },

    showAlert(message, type) {
      this.alert.message = message;
      this.alert.type = type;
      this.showAlertModal = true;

      // Fermer le modal après 3 secondes
      setTimeout(() => {
        this.showAlertModal = false;
        this.alert.message = '';
        this.alert.type = '';
      }, 3000);
    },

    openArchiveModal(userId) {
      this.selectedUserId = userId;
      this.showArchiveModal = true;
    },
    closeArchiveModal() {
      this.selectedUserId = null;
      this.showArchiveModal = false;
    },
    archiveUser(userId) {
      if (!userId) {
        console.error("Id de l' Utilisateur n'est pas défini");
        return;
      }
      const token = this.checkAuthorization();
      if (!token) return;
// archivation de l'utilisateur 
      axios.put(`${API_URL}/users/${userId}/archive`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Utilisateur archivé:', response.data);
        this.fetchUsers();
        this.closeArchiveModal();
        this.showAlert('Utilisateur archivé avec succès.', 'success');
      })
      .catch(error => {
        console.error('Error archiving user:', error);
        this.showAlert('Échec de l\'archivage de l\'utilisateur.', 'error');
      });
    },

    viewDetails(user) {
      this.selectedUser = user;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.selectedUser = null;
      this.showDetailsModal = false;
    },
    filterByRole() {
      this.showFilterDropdown = !this.showFilterDropdown;
    },

    // Méthodes de pagination
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return; 
      this.fetchUsers(page, this.itemsPerPage);
    },

    closeUserModal() {
      this.showModal = false;
      this.editUserData = null;
    },

    onUserUpdated() {
      this.fetchUsers();
      this.closeUserModal();
      this.showAlert('Utilisateur mis à jour avec succès.', 'success');
    },
  },

  mounted() {
    this.fetchUsers();
    this.interval = setInterval(() => {
      this.fetchUsers();
    }, 2000);
    
  },
};
</script>
