<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Header -->
    <header class="bg-lime-500 p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="../assets/logo.png" alt="Logo" class="h-10" />
          <span class="text-white text-xl font-bold">NOVA Lead</span>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="showModal = true"
            class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
          >
            New <span class="ml-2">+</span>
          </button>
          <button
            @click="filterByRole"
            class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition flex items-center"
          >
            Filtrer
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
      <div v-if="showFilterDropdown" class="mb-4">
        <select v-model="filterRole" @change="fetchUsers" class="border rounded p-2">
          <option value="">Tous les Rôles</option>
          <option value="Admin">Admin</option>
          <option value="Client">Client</option>
          <option value="AgentSupport">Agent Support</option>
        </select>
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
  <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <h2 class="text-xl font-bold mb-6 text-center">Détails de l'utilisateur</h2>
      <div class="text-left space-y-2 pl-4">
        <p><strong>Id :</strong> <span class="ml-2">{{ selectedUser._id }}</span></p>
        <p><strong>Nom :</strong> <span class="ml-2">{{ selectedUser.name }}</span></p>
        <p><strong>Email :</strong> <span class="ml-2">{{ selectedUser.email }}</span></p>
        <p><strong>Contact :</strong> <span class="ml-2">{{ selectedUser.contact }}</span></p>
        <p><strong>Rôle :</strong> <span class="ml-2">{{ selectedUser.role }}</span></p>
      </div>
      <button @click="closeDetailsModal" class="mt-6 bg-green-500 text-white px-4 py-2 rounded mx-auto block">Fermer</button>
    </div>
  </div>

      <!-- Modal pour l'édition d'utilisateur -->
      <div v-if="editUserData" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
          <h2 class="text-xl font-bold mb-2">Modifier l'Utilisateur</h2>
          <form @submit.prevent="updateUser">
            <div class="mb-4">
              <label class="block text-gray-700">Nom:</label>
              <input v-model="editUserData.name" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Email:</label>
              <input v-model="editUserData.email" type="email" class="w-full px-4 py-2 border rounded-md" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Contact:</label>
              <input v-model="editUserData.contact" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Rôle:</label>
              <input v-model="editUserData.role" type="text" class="w-full px-4 py-2 border rounded-md" />
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Enregistrer</button>
            <button @click="closeEditModal" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
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
</template>


<script>
import axios from 'axios';
import UserModal from '@/components/layouts/UserModal.vue';

export default {
  name: 'Utilisateurs',
  components: {
    UserModal,
  },
  data() {
    return {
      showModal: false,
      showEditModal: false,
      showDetailsModal: false,
      showArchiveModal: false,
      users: [],
      filterRole: '',
      selectedUser: null,
      selectedUserId: null,
      showFilterDropdown: false,
      editUserData: null,
      alert: { message: '', type: '' },
      showAlertModal: false,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        return this.filterRole ? user.role === this.filterRole : true;
      });
    },
  },
  methods: {
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
    fetchUsers() {
  const token = this.checkAuthorization(); // Ensure user is authorized
  if (!token) return; // Prevent fetching if not authorized

  axios.get('http://localhost:5000/api/users/all', {
    headers: {
      Authorization: `Bearer ${token}` // Send the token in the request
    }
  })
  .then(response => {
    // Filtrer les utilisateurs archivés ici si nécessaire
    this.users = response.data.filter(user => !user.isArchived); // Supposant que `isArchived` est un champ dans vos données utilisateurs
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });
},

    openEditModal(user) {
      this.editUserData = { ...user };
      this.showEditModal = true; // Show the modal when editing
    },
    closeEditModal() {
      this.editUserData = null;
      this.showEditModal = false; // Hide the modal when done
    },

    showAlert(message, type) {
    this.alert.message = message;
    this.alert.type = type; // 'success' ou 'error'
    this.showAlertModal = true;

    // Fermez le modal après 3 secondes
    setTimeout(() => {
      this.showAlertModal = false;
      this.alert.message = '';
      this.alert.type = '';
    }, 3000);
  },
     updateUser() {
    const token = this.checkAuthorization(); // Ensure user is authorized
    if (!token) return; // Prevent updating if not authorized

    axios.put(`http://localhost:5000/api/users/${this.editUserData._id}`, this.editUserData, {
      headers: {
        Authorization: `Bearer ${token}` // Send the token in the request
      }
    })
    .then(response => {
      console.log('Utilisateur mis à jour:', response.data);
      this.fetchUsers();
      this.closeEditModal();
      this.showAlert('Utilisateur mis à jour avec succès.', 'success'); // Appel de showAlert
    })
    .catch(error => {
      console.error('Error updating user:', error);
      this.showAlert('Échec de la mise à jour de l\'utilisateur.', 'error'); // Appel de showAlert
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
    const token = this.checkAuthorization(); // Ensure user is authorized
    if (!token) return; // Prevent archiving if not authorized

    axios.put(`http://localhost:5000/api/users/${userId}/archive`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // Send the token in the request
      }
    })
    .then(response => {
      console.log('Utilisateur archivé:', response.data);
      this.fetchUsers(); // Récupérez les utilisateurs mis à jour
      this.closeArchiveModal();
      this.showAlert('Utilisateur archivé avec succès.', 'success'); // Appel de showAlert
    })
    .catch(error => {
      console.error('Error archiving user:', error);
      this.showAlert('Échec de l\'archivage de l\'utilisateur.', 'error'); // Appel de showAlert
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
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>


<style scoped>
/* Ajoutez ici des styles supplémentaires si nécessaire */
</style>
