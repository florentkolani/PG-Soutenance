<template>
  <div class="w-full px-4 py-3">
    <!-- Header Component -->
    <Header title="NOVA LEAD" primaryActionText="Nouveau Pays" @primaryAction="openNewCountryModal"
      @filterAction="openFilterOptions" @goToDashboard="redirectToDashboard" />

    <!-- List of countries -->
    <main class="w-full px-4 py-3">
      <h1 class="text-2xl font-bold text-gray-800">Liste des pays</h1>
      <div class="overflow-x-auto relative overflow-y-hidden">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="border border-gray-300 px-4 py-2">Nom</th>
              <th class="border border-gray-300 px-4 py-2">Code</th>
              <th class="border border-gray-300 px-4 py-2">Date de création</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-normal">
            <tr v-for="country in paginatedCountries" :key="country._id"
              class="border-b border-gray-200 hover:bg-gray-100">
              <td class="border px-4 py-2">{{ country.name }}</td>
              <td class="border px-4 py-2">{{ country.code }}</td>
              <td class="border px-4 py-2 text-center">
                {{ new Date(country.createdAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </td>
              <td class="py-3 px-6 text-center whitespace-nowrap">
                <div class="flex flex-row items-center justify-center space-x-1">
                  <button @click="editCountry(country)"
                    class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">Modifier</button>
                  <button @click="viewCountryDetails(country)"
                    class="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">Détails</button>
                  <button @click="archiveCountry(country._id)"
                    class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">Archiver</button>
                  <button @click="openCityModal(country)"
                    class="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">Ajout de
                    ville</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Pagination -->
    <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" :current-page.sync="currentPage"
      @page-changed="handlePageChange" />

    <!-- Country Modal -->
    <CountryModal :showModal="showCountryModal" :country="selectedCountry" @close="closeCountryModal"
      @save="saveCountry" />

    <!-- Dialogue pour les détails -->
    <div v-if="selectedCountryDetails" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg min-w-max p-6 sm:w-2/3 shadow-md relative">
        <h2 class="text-xl font-bold mb-4 text-center">Détails sur le Pays</h2>
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-gray-300 px-4 py-2">Libellé</th>
              <th class="border border-gray-300 px-4 py-2">Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-bold">Nom du pays</td>
              <td class="border border-gray-300 px-4 py-2">{{ selectedCountryDetails.name }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-bold">Code du pays</td>
              <td class="border border-gray-300 px-4 py-2">{{ selectedCountryDetails.code }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="closeCountryDetails"
          class="bg-gray-500 text-white px-4 py-2 mt-6 rounded-md mx-auto block">Fermer</button>
      </div>
    </div>

    <!-- Dialogue pour l'édition -->
    <div v-if="editCountryData" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Modifier le pays</h2>
        <form @submit.prevent="updateCountry">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom du pays</label>
            <input v-model="editCountryData.name" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Entrez le nom du pays" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Code du pays</label>
            <input v-model="editCountryData.code" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Entrez le code du pays" />
          </div>
          <div class="flex justify-center space-x-4">
            <button type="submit"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition-all">
              Enregistrer
            </button>
            <button @click="closeEditModal" type="button"
              class="bg-gray-300 hover:bg-gray-200 text-black px-6 py-2 rounded-md shadow-md transition-all">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="showArchiveConfirmation"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <svg class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p class="text-center mb-6">Êtes-vous sûr de vouloir archiver ce pays ?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmArchive"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md shadow-md transition-all">
            Oui, archiver
          </button>
          <button @click="cancelArchive"
            class="bg-gray-300 hover:bg-gray-200 text-black px-6 py-2 rounded-md shadow-md transition-all">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Success and Error Dialogs -->
    <div v-if="successMessage" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
        <svg class="mx-auto text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 11.917 9.724 16.5 19 7.5" />
        </svg>
        <h3 class="text-lg font-semibold text-green-700">Succès!</h3>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="bg-green-500 text-white px-4 py-2 mt-4 rounded-md">Fermer</button>
      </div>
    </div>
    <div v-if="errorMessage" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
        <svg class="mx-auto text-red-500 w-12 h-12 dark:text-red-400" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6m0-6l6 6" />
        </svg>
        <h3 class="text-lg font-semibold text-red-700">Erreur!</h3>
        <p>{{ errorMessage }}</p>
        <button @click="errorMessage = ''" class="bg-red-500 text-white px-4 py-2 mt-4 rounded-md">Fermer</button>
      </div>
    </div>

    <!-- City Modal -->
    <CityModal :showModal="showCityModal" :city.sync="selectedCity" @close="closeCityModal" @save="saveCity" />

  </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/layouts/Header.vue";
import CountryModal from '@/components/layouts/CountryModal.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import CityModal from '@/components/layouts/CityModal.vue';
import { API_URL } from '@/services/config';

export default {
  components: {
    Header,
    CountryModal,
    Pagination,
    CityModal
  },
  emits: ['close', 'save'],
  data() {
    return {
      countries: [],
      showCountryModal: false,
      selectedCountry: null,
      selectedCountryDetails: null,
      editCountryData: null,
      showArchiveConfirmation: false,
      countryToArchive: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      successMessage: '',
      errorMessage: '',
      showCityModal: false,
      selectedCity: { name: '', countryId: '' },
    };
  },
  computed: {
    paginatedCountries() {
      return this.countries;
    }
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await axios.get(`${API_URL}/countries`, {
          params: {
            page: this.currentPage,
            limit: this.itemsPerPage
          }
        });
        this.countries = response.data.countries || [];
        this.totalItems = response.data.totalItems || 0;
        if (this.countries.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.fetchCountries();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error);
      }
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.fetchCountries();
    },
    openNewCountryModal() {
      this.selectedCountry = { name: '', code: '' };
      this.showCountryModal = true;
    },
    editCountry(country) {
      this.editCountryData = { ...country };
    },
    archiveCountry(id) {
      this.countryToArchive = id;
      this.showArchiveConfirmation = true;
    },
    cancelArchive() {
      this.showArchiveConfirmation = false;
      this.countryToArchive = null;
    },
    async confirmArchive() {
      try {
        await axios.put(`${API_URL}/countries/${this.countryToArchive}/archive`);
        this.fetchCountries();
        this.showArchiveConfirmation = false;
        this.countryToArchive = null;
        this.successMessage = 'Pays archivé avec succès.';
      } catch (error) {
        console.error('Erreur lors de l\'archivage du pays:', error);
        this.errorMessage = 'Erreur lors de l\'archivage du pays.';
        this.showArchiveConfirmation = false;
        this.countryToArchive = null;
      }
    },
    closeCountryModal() {
      this.showCountryModal = false;
      this.selectedCountry = null;
    },
    closeEditModal() {
      this.editCountryData = null;
    },
    async saveCountry(country) {
      try {
        await axios.post(`${API_URL}/countries`, country);
        this.fetchCountries();
        this.closeCountryModal();
        this.successMessage = 'Pays enregistré avec succès.';
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du pays:', error);
        this.errorMessage = 'Erreur lors de l\'enregistrement du pays.';
      }
    },
    openFilterOptions() {
      console.log('Options de filtrage ouvertes');
    },
    redirectToDashboard() {
      console.log('Redirection vers le tableau de bord');
    },
    viewCountryDetails(country) {
      this.selectedCountryDetails = country;
    },
    closeCountryDetails() {
      this.selectedCountryDetails = null;
    },
    async updateCountry() {
      try {
        await axios.put(`${API_URL}/countries/${this.editCountryData._id}`, this.editCountryData);
        this.fetchCountries();
        this.closeEditModal();
        this.successMessage = 'Pays mis à jour avec succès.';
      } catch (error) {
        this.closeEditModal();
        console.error('Erreur lors de la mise à jour du pays:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du pays.';
      }
    },
    openCityModal(country) {
      localStorage.setItem('selectedCountryId', country._id);
      this.$router.push({ name: 'GestionsVille', query: { countryId: country._id } });
    },
    closeCityModal() {
      this.showCityModal = false;
      this.selectedCity = { name: '', countryId: '' };
    },
    async saveCity(city) {
      try {
        await axios.post(`${API_URL}/cities`, city);
        this.fetchCountries();
        this.closeCityModal();
        this.successMessage = 'Ville enregistrée avec succès';
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la ville:', error);
        this.errorMessage = 'Erreur lors de l\'enregistrement de la ville';
      }
    },
  },
  created() {
    this.fetchCountries();
  }
};
</script>