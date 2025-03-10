<template>
  <div class="bg-gray-100 min-h-screen">
    <Header 
      title="NOVA LEAD" 
      primaryActionText="Nouveau type de demande" 
      @primaryAction="showTypeModal = true" 
      @filterAction="openRequestTypeFilterOptions" 
       @goToDashboard="redirectToDashboard"
    />

    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des types de demande</h1>
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="border border-gray-300 px-4 py-2 text-left">Nom</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th class="border border-gray-300 px-4 py-2 text-center">Date de création</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="type in types" :key="type._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2">{{ type.name }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ truncateText(type.description, 50) }}</td>
            <td class="border px-4 py-2 text-center">
              {{ new Date(type.createdAt).toLocaleString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
              }) }}
            </td>
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

    <div v-if="selectedType" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
  <div class="bg-white rounded-lg p-6 w-2/3 shadow-md">
    <h2 class="text-xl font-bold mb-4 text-center">Détails du TypeDeDemande</h2>
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
          <td class="border border-gray-300 px-4 py-2">{{ selectedType.name }}</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-2 font-bold">Description</td>
          <td class="border border-gray-300 px-4 py-2">{{ selectedType.description }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-6">
      <button @click="closeDetails" class="bg-gray-500 text-white px-4 py-2 rounded-md">Fermer</button>
    </div>
  </div>
</div>


    <!-- Dialogue pour l'édition -->
<div v-if="editTypeData" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Modifier le TypeDeDemande</h2>
    <form @submit.prevent="updateType">
      <!-- Champ Nom -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Nom :</label>
        <input 
          v-model="editTypeData.name" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez le nom"
        />
      </div>
      <!-- Champ Description -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Description :</label>
        <textarea 
          v-model="editTypeData.description" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez une description"
        ></textarea>
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


    <!-- Confirmation de suppression -->
    <div v-if="confirmArchiveId" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center text-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-4 text-center">Archiver le TypeDeDemande</h2>
        <p class="text-center">Êtes-vous sûr de vouloir archiver ce TypeDedemande ?</p>
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
import { API_URL } from '@/services/config';


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
    redirectToDashboard() {
      this.$router.push('/dashboard'); // Redirection vers la route du dashboard
    },
    getToken() {
      return localStorage.getItem('token');
    },

    openRequestTypeFilterOptions() {
      // Logic for filtering request types
    },
    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + '...';
      }
      return text;
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
    const response = await fetch(`${API_URL}/types?page=${this.currentPage}&limit=${this.itemsPerPage}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des TypesDeDemande.');

    const data = await response.json();

    // Trier les types de demande par ordre alphabétique (en fonction du nom ou du label)
    const sortedTypes = data.types.sort((a, b) => {
      const nameA = (a.name ?? '').toUpperCase(); // Utiliser le champ 'name' (ou 'label' si applicable)
      const nameB = (b.name ?? '').toUpperCase(); // Utiliser le champ 'name' (ou 'label' si applicable)
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    // Assigner les types triés
    this.types = sortedTypes;

    // Mettre à jour la pagination
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
    const response = await fetch(`${API_URL}/types/${this.confirmArchiveId}/archive`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Erreur lors de l\'archivage du type de demande.');

    // this.alertTitle = 'Succès';
    this.alertMessage = 'Le TypeDeDemande a été archivé avec succès.';
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
    async updateType() {
      const token = this.getToken();
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/types/${this.editTypeData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.editTypeData),
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour du TypeDeDemande.');

        this.alertTitle = 'Succès';
        this.alertMessage = 'Le TypeDeDemande a été mis à jour avec succès.';
        await this.getTypes(); // Reload types after update
      } catch (error) {
        console.error(error);
        this.alertTitle = 'Erreur';
        this.alertMessage = 'Une erreur est survenue lors de la mise à jour.';
      } finally {
        this.closeEditModal();
      }
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles ici si nécessaire */
</style>
