<template>
  <div class="bg-gray-100 min-h-screen">
    
    <Header 
      title="NOVA LEAD" 
      primaryActionText="New User" 
      @primaryAction="showModal = true" 
      @filterChanged="onFilterChanged"
      :filterAction="true" 
      :filterOptions="userFilterOptions" 
    />
    <GoToDashboard />

    <main class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Liste des Utilisateurs</h1>
      </div>

      <!-- Table des utilisateurs -->
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
              <button @click="viewDetails(user)" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Détails</button>
              <button @click="openEditModal(user)" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Modifier</button>
              <button @click="openArchiveModal(user._id)" class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Archiver</button>
            </td> 
            
          </tr>
        </tbody>
      </table>

      <!-- Modal d'enregistrement d'utilisateur -->
      <UserModal v-if="showModal" @close="showModal = false" />

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
          <td class="border border-gray-300 px-4 py-2 font-bold">ID</td>
          <td class="border border-gray-300 px-4 py-2">{{ selectedUser._id }}</td>
        </tr>
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


      <!-- Modal pour l'édition d'utilisateur -->
<div v-if="editUserData" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Modifier l'Utilisateur</h2>
    <form @submit.prevent="updateUser">
      <!-- Champ Nom -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Nom :</label>
        <input 
          v-model="editUserData.name" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez le nom"
        />
      </div>
      <!-- Champ Email -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Email :</label>
        <input 
          v-model="editUserData.email" 
          type="email" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez l'email"
        />
      </div>
      <!-- Champ Contact -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Contact :</label>
        <input 
          v-model="editUserData.contact" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez le contact"
        />
      </div>
      <!-- Champ Rôle -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Rôle :</label>
        <input 
          v-model="editUserData.role" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez le rôle"
        />
      </div>
      <!-- Champ Pays -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Pays :</label>
        <input 
          v-model="editUserData.pays" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez le pays"
        />
      </div>
      <!-- Champ Ville -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Ville :</label>
        <input 
          v-model="editUserData.ville" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez la ville"
        />
      </div>
      <!-- Boutons -->
      <div class="flex justify-center space-x-4">
        <button 
          type="submit" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition-all"
        >
          Enregistrer
        </button>
        <button 
          @click="closeEditModal" 
          type="button" 
          class="bg-gray-500 hover:bg-gray-300 text-black px-6 py-2 rounded-md shadow-md transition-all"
        >
          Annuler
        </button>
      </div>
    </form>
  </div>
</div>

      <!-- Confirmation d'archivage -->
      <div v-if="showArchiveModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-enter">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-xl font-bold mb-4 text-center">Confirmer l'archivage</h2>
          <p>Êtes-vous sûr de vouloir archiver cet utilisateur ?</p>
          <div class="flex justify-center mt-4">
            <button @click="archiveUser(selectedUserId)" class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Oui, archiver</button>
            <button @click="closeArchiveModal" class="bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
          </div>
        </div>
      </div>
    </main>
    <!-- Modal d'alerte -->
<div v-if="showAlertModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-xl font-bold mb-4" :class="{'text-green-500 text-center': alert.type === 'success', 'text-red-500 text-center': alert.type === 'error'}">
      {{ alert.type === 'success' ? 'Succès' : 'Erreur' }}
    </h2>
    <p>{{ alert.message }}</p>
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
    //charge tous les utilisateurs non archivées
    fetchUsers(page = this.currentPage, limit = this.itemsPerPage) {
      const token = this.checkAuthorization();
      if (!token) return;

      axios.get('http://localhost:5000/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          limit: limit,
        }
      })
      .then(response => {
        this.users = response.data.data.filter(user => !user.isArchived);
      this.pagination = {
        currentPage: response.data.currentPage,
        totalItems: response.data.totalItems,
        totalPages: response.data.totalPages,
        itemsPerPage: limit,
      }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
    },

    onFilterChanged(role) {
      this.selectedRole = role;
    },

    openEditModal(user) {
      this.editUserData = { ...user };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.editUserData = null;
      this.showEditModal = false;
    },

    showAlert(message, type) {
      this.alert.message = message;
      this.alert.type = type;
      this.showAlertModal = true;

      // Fermez le modal après 3 secondes
      setTimeout(() => {
        this.showAlertModal = false;
        this.alert.message = '';
        this.alert.type = '';
      }, 3000);
    },

    updateUser() {
      const token = this.checkAuthorization();
      if (!token) return;
//Mise à jour de l'utilisateur
      axios.put(`http://localhost:5000/api/users/${this.editUserData._id}`, this.editUserData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Utilisateur mis à jour:', response.data);
        this.fetchUsers();
        this.closeEditModal();
        this.showAlert('Utilisateur mis à jour avec succès.', 'success');
      })
      .catch(error => {
        console.error('Error updating user:', error);
        this.showAlert('Échec de la mise à jour de l\'utilisateur.', 'error');
      });
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
        console.error('User ID is undefined');
        return;
      }
      const token = this.checkAuthorization();
      if (!token) return;
// archivation de l'utilisateur 
      axios.put(`http://localhost:5000/api/users/${userId}/archive`, {}, {
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
  },

  mounted() {
    this.fetchUsers();
    this.interval = setInterval(() => {
      this.fetchUsers();
    }, 1000);
    
  },
};
</script>
