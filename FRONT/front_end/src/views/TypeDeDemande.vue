<template>
  <div class="bg-gray-100 min-h-screen">
    <Header title="NOVA LEAD" primaryActionText="Nouveau type de demande" @primaryAction="showTypeModal = true"
      @filterAction="openRequestTypeFilterOptions" @goToDashboard="redirectToDashboard" />

    <main class="w-full px-4 py-3">
      <h1 class="text-2xl font-bold mb-4">Liste des types de demande</h1>
      <div class="overflow-x-auto relative overflow-y-hidden">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="border border-gray-300 px-4 py-2 text-left">Nom</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th class="border border-gray-300 px-4 py-2 text-center">Date de création</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-normal">
            <tr v-for="type in types" :key="type._id" :class="[
              'border-b border-gray-200 hover:bg-gray-100',
              type.isArchived ? 'bg-red-300' : ''
            ]">
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
              <td class="py-3 px-6 text-center whitespace-nowrap">
                <div class="flex flex-row items-center justify-center space-x-1">
                  <button @click="viewDetails(type)" :class="[
                    'px-2 py-1 rounded text-sm',
                    type.isArchived
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  ]" :disabled="type.isArchived">
                    Détails
                  </button>
                  <button @click="openEditModal(type)" :class="[
                    'px-2 py-1 rounded text-sm',
                    type.isArchived
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  ]" :disabled="type.isArchived">
                    Modifier
                  </button>
                  <button @click="type.isArchived ? confirmUnarchive(type._id) : confirmArchive(type._id)" :class="[
                    'text-white px-2 py-1 rounded text-sm',
                    type.isArchived ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
                  ]">
                    {{ type.isArchived ? 'Désarchiver' : 'Archiver' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Message d'alerte -->
      <div v-if="alertMessage"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
        <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
          <div class="text-6xl mb-6 text-center text-green-500">
            <i class="fas fa-check-circle"></i>
          </div>
          <p class="text-xl mb-6 text-center text-gray-700">
            {{ alertMessage }}
          </p>
          <button @click="closeAlert"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-300">
            Fermer
          </button>
        </div>
      </div>
    </main>

    <!-- Type Modal -->
    <TypeModal v-if="showTypeModal" :typeToEdit="editTypeData" @close="closeTypeModal" @type-updated="onTypeUpdated" />
    <div v-if="selectedType" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-4">
      <div class="bg-white rounded-lg p-2 shadow-md overflow-x-hidden">
        <h2 class="text-xl font-bold mb-4 text-center">Détails du type de demande</h2>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-200 text-left">
                <th class="border border-gray-300 px-4 py-2">Libellé</th>
                <th class="border border-gray-300 px-4 py-2">Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Nom de type de demande</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedType.name }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-4 py-2 font-bold">Description du type de demande</td>
                <td class="border border-gray-300 px-4 py-2">{{ selectedType.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-center mt-6">
          <button @click="closeDetails" class="bg-gray-500 text-white px-4 py-2 rounded-md">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Confirmation de suppression -->
    <div v-if="confirmArchiveId"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center text-center p-4">
      <div class="bg-white rounded-lg p-2 sm:w-1/2 shadow-md min-w-max">
        <svg class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p class="text-center">{{ isUnarchiving ? 'Êtes-vous sûr de vouloir désarchiver ce type de demande ?' :
          'Êtes-vous sûr de vouloir archiver ce type de demande ?' }}</p>
        <div class="flex justify-center mt-4">
          <button @click="isUnarchiving ? unarchiveType() : archiveType()"
            :class="['text-white px-4 py-2 rounded-md', isUnarchiving ? 'bg-yellow-500' : 'bg-red-500']">
            {{ isUnarchiving ? 'Oui, désarchiver' : 'Oui, archiver' }}
          </button>
          <button @click="closeConfirmArchive" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />
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
      isUnarchiving: false,
      alertMessage: '',
      alertTitle: '',
      currentPage: 1, // Page actuelle
      itemsPerPage: 10, // Nombre d'éléments par page
      totalItems: 0, // Nombre total d'éléments
    };
  },

  mounted() {
    this.getTypes();
    this.interval = setInterval(() => { this.getTypes(); }, 1000);
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
      this.showTypeModal = true;
    },
    closeTypeModal() {
      this.showTypeModal = false;
      this.editTypeData = null;
    },
    onTypeUpdated({ type, typeName }) {
      this.getTypes();
      this.closeTypeModal();

      if (type === 'create') {
        this.alertMessage = `Le type de demande ${typeName} a été ajouté avec succès`;
      } else {
        this.alertMessage = `Le type de demande ${typeName} a été mis à jour avec succès`;
      }
    },
    closeAlert() {
      this.alertMessage = '';
    },
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.closeAlert();
      }, 10000);
    },
    closeConfirmArchive() {
      this.confirmArchiveId = null;
      this.isUnarchiving = false;
    },
    confirmArchive(id) {
      this.confirmArchiveId = id;
      this.isUnarchiving = false;
    },
    confirmUnarchive(id) {
      this.confirmArchiveId = id;
      this.isUnarchiving = true;
    },
    async unarchiveType() {
      const token = this.getToken();
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/types/${this.confirmArchiveId}/unarchive`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Erreur lors du désarchivage du type de demande.');

        this.alertMessage = 'Le type de demande a été désarchivé avec succès.';
        await this.getTypes();
      } catch (error) {
        console.error(error);
        this.alertTitle = 'Erreur';
        this.alertMessage = 'Une erreur est survenue lors du désarchivage.';
      } finally {
        this.confirmArchiveId = null;
        this.isUnarchiving = false;
      }
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles ici si nécessaire */
</style>
