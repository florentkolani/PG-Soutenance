<template>
  <div class="bg-gray-100 min-h-screen">
    <Header 
      title="NOVA LEAD" 
      primaryActionText="New TypeDeDemande" 
      @primaryAction="showTypeModal = true" 
      @filterAction="openRequestTypeFilterOptions" 
    />
    <GoToDashboard />

    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des Types de Demande</h1>
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Nom</th>
            <th class="border border-gray-300 px-4 py-2">Description</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="type in types" :key="type._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2 text-center">{{ type.name }}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">{{ type.description }}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              <button @click="viewDetails(type)" class="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600">Détails</button>
              <button @click="openEditModal(type)" class="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Modifier</button>
              <button @click="confirmArchive(type._id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Archiver</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Message d'alerte -->
      <div v-if="alertMessage" class="mt-4 text-center">
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">{{ alertTitle }}</strong>
          <span class="block sm:inline">{{ alertMessage }}</span>
          <span @click="alertMessage = ''" class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
            <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fermer</title>
              <path d="M10 9l5-5 1.414 1.414L11.414 10l5 5L14 16l-5-5-5 5-1.414-1.414 5-5-5-5L4 4z" />
            </svg>
          </span>
        </div>
      </div>
    </main>

    <!-- Type Modal -->
    <TypeModal :showModal="showTypeModal" @close="showTypeModal = false" @type-added="getTypes" />

    <!-- Dialogue pour les détails -->
  <div v-if="selectedType" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 w-1/3 shadow-md">
      <h2 class="text-xl font-bold mb-4 text-center">Détails du Type de Demande</h2>
      <div class="text-left space-y-2 pl-4">
        <p><strong>ID :</strong> <span class="ml-2">{{ selectedType._id }}</span></p>
        <p><strong>Nom :</strong> <span class="ml-2">{{ selectedType.name }}</span></p>
        <p><strong>Description :</strong> <span class="ml-2">{{ selectedType.description }}</span></p>
      </div>
      <div class="flex justify-center mt-6">
        <button @click="closeDetails" class="bg-gray-500 text-white px-4 py-2 rounded-md">Fermer</button>
      </div>
    </div>
  </div>

    <!-- Dialogue pour l'édition -->
    <div v-if="editTypeData" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-2 text-center">Modifier le Type de Demande</h2>
        <form @submit.prevent="updateType">
          <div class="mb-4">
            <label class="block text-gray-700">Nom:</label>
            <input v-model="editTypeData.name" type="text" class="w-full px-4 py-2 border rounded-md" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Description:</label>
            <textarea v-model="editTypeData.description" class="w-full px-4 py-2 border rounded-md"></textarea>
          </div>
          <div class="flex justify-center mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Enregistrer</button>
            <button @click="closeEditModal" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation de suppression -->
    <div v-if="confirmArchiveId" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center text-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-4 text-center">Archiver le Type de Demande</h2>
        <p class="text-center">Êtes-vous sûr de vouloir archiver ce type de demande ?</p>
        <div class="flex justify-center mt-4">
          <button @click="archiveType" class="bg-red-500 text-white px-4 py-2 rounded-md">Oui, archiver</button>
          <button @click="closeConfirmArchive" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
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
import TypeModal from '@/components/layouts/TypeDeDemandeModal.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import Header from '@/components/layouts/Header.vue'; 
import GoToDashboard from '@/components/layouts/GoToDashboard.vue';


export default {
  name: 'TypesDeDemande',
  components: {
    TypeModal,
    Pagination,
    Header,
    GoToDashboard,
  },
  data() {
    return {
      showTypeModal: false,
      types: [],
      selectedType: null,
      editTypeData: null,
      confirmArchiveId: null,
      alertMessage: '',
      alertTitle: '',
      currentPage: 1, // Page actuelle
      itemsPerPage: 10, // Nombre d'éléments par page
      totalItems: 0, // Nombre total d'éléments
    };
  },

  mounted() {
    this.getTypes(); 
    this.interval = setInterval(() => {this.getTypes();}, 1000); 
    },
    
  methods: {
    getToken() {
      return localStorage.getItem('token');
    },

    openRequestTypeFilterOptions() {
      // Logic for filtering request types
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

    async getTypes() {
  const token = this.checkAuthorization();
  if (!token) return;

  try {
    const response = await fetch(`http://localhost:5000/api/types?page=${this.currentPage}&limit=${this.itemsPerPage}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des types de demande.');

    const data = await response.json();
    this.types = data.types; // Charge uniquement les non-archivés
    this.totalItems = data.totalItems;
    this.totalPages = data.totalPages;
    this.currentPage = data.currentPage;
  } catch (error) {
    console.error(error);
  }
},


async archiveType() {
  const token = this.getToken();
  if (!token) return;

  try {
    const response = await fetch(`http://localhost:5000/api/types/${this.confirmArchiveId}/archive`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Erreur lors de l\'archivage du type de demande.');

    this.alertTitle = 'Succès';
    this.alertMessage = 'Le type de demande a été archivé avec succès.';
    await this.getTypes(); // Recharge les types après l'archivage
  } catch (error) {
    console.error(error);
    this.alertTitle = 'Erreur';
    this.alertMessage = 'Une erreur est survenue lors de l\'archivage.';
  } finally {
    this.confirmArchiveId = null;
  }
},

    goToPage(page) {
      this.currentPage = page;
      this.getTypes(); 
    },
    openModal() {
      this.showTypeModal = true;
    },
    viewDetails(type) {
      this.selectedType = type;
    },
    closeDetails() {
      this.selectedType = null;
    },
    openEditModal(type) {
      this.editTypeData = { ...type };
    },
    closeEditModal() {
      this.editTypeData = null;
    },

    closeConfirmArchive() {
      this.confirmArchiveId = null; 
  },
  confirmArchive(id) {
      this.confirmArchiveId = id;
    },

  },
    
    async updateType() {
      const token = this.getToken();
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/types/${this.editTypeData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.editTypeData),
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour du type de demande.');

        this.alertTitle = 'Succès';
        this.alertMessage = 'Le type de demande a été mis à jour avec succès.';
        this.getTypes();
      } catch (error) {
        console.error(error);
        this.alertTitle = 'Erreur';
        this.alertMessage = 'Une erreur est survenue lors de la mise à jour.';
      } finally {
        this.closeEditModal();
      }
    },
    
    async archiveType() {
      const token = this.getToken();
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/types/${this.confirmArchiveId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Erreur lors de l\'archivage du type de demande.');

        this.alertTitle = 'Succès';
        this.alertMessage = 'Le type de demande a été archivé avec succès.';
        this.getTypes();
      } catch (error) {
        console.error(error);
        this.alertTitle = 'Erreur';
        this.alertMessage = 'Une erreur est survenue lors de l\'archivage.';
      } finally {
        this.confirmArchiveId = null;
      }
    },
};
</script>

<style scoped>
/* Ajoutez des styles ici si nécessaire */
</style>
