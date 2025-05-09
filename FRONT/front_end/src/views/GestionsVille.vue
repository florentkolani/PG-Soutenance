<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header Component -->
    <Header title="NOVA LEAD" primaryActionText="Nouvelle Ville" @primaryAction="openNewCityModal"
      @filterAction="openFilterOptions" @goToDashboard="redirectToDashboard" />

    <!-- Success and Dialogue Messages -->
    <div v-if="successMessage" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
        <svg class="mx-auto text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 11.917 9.724 16.5 19 7.5" />
        </svg>
        <h2 class="text-xl font-bold text-green-600 mb-4 text-center">Succès</h2>
        <p>{{ successMessage }}</p>
        <button @click="closeSuccessMessage" class="bg-green-500 text-white px-4 py-2  mt-4 rounded-md">Fermer</button>
      </div>
    </div>
    <div v-if="errorMessage" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
        <svg class="mx-auto text-red-500 w-12 h-12 dark:text-red-400" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6m0-6l6 6" />
        </svg>
        <h2 class="text-xl font-bold text-red-600 mb-4 text-center">Erreur</h2>
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorMessage" class="bg-red-500 text-white px-4 py-2 mt-4 rounded-md">Fermer</button>
      </div>
    </div>

    <!-- List of cities -->
    <main class="flex-grow w-full px-4 py-3">
      <div class="flex items-center mb-4">
        <button @click="goBack" class="text-blue-500 mt-3 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800 ml-2">
          LISTES DES VILLES {{ cities[0]?.country ? `: ${cities[0].country.name}` : '' }}
        </h1>
      </div>
      <div class="overflow-x-auto relative overflow-y-hidden">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="border border-gray-300 px-4 py-2">Villes</th>
              <th class="border border-gray-300 px-4 py-2">Date de création</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-normal">
            <tr v-for="city in paginatedCities" :key="city._id" class="border-b border-gray-200 hover:bg-gray-100">
              <td class="border px-4 py-2">{{ city.name }}</td>
              <td class="border px-4 py-2 text-center">
                {{ new Date(city.createdAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </td>

              <td class="py-3 px-6 text-center whitespace-nowrap">
                <div class="flex flex-row items-center justify-center space-x-1">
                  <button @click="editCity(city)"
                    class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">Modifier</button>
                  <button @click="viewCityDetails(city)"
                    class="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">Détails</button>
                  <button @click="archiveCity(city._id)"
                    class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">Archiver</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Pagination -->
    <div class="mt-auto">
      <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />
    </div>

    <!-- City Modal -->
    <CityModal :showModal="showCityModal" :city.sync="selectedCity" @close="closeCityModal" @save="saveCity" />

    <!-- Dialogue pour les détails -->
    <div v-if="selectedCityDetails" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-6 w-2/3 shadow-md relative">
        <h2 class="text-xl font-bold mb-4 text-center">Détails sur la ville</h2>
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-gray-300 px-4 py-2">Libellé</th>
              <th class="border border-gray-300 px-4 py-2">Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-bold">Nom de la ville</td>
              <td class="border border-gray-300 px-4 py-2">{{ selectedCityDetails.name }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-bold">Pays de la ville</td>
              <td class="border border-gray-300 px-4 py-2">{{ selectedCityDetails.country.name }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="closeCityDetails"
          class="bg-gray-500 text-white px-4 py-2 mt-6 rounded-md mx-auto block">Fermer</button>
      </div>
    </div>

    <!-- Dialogue pour l'édition -->
    <div v-if="editCityData" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Modifier la ville</h2>
        <form @submit.prevent="updateCity">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la ville</label>
            <input v-model="editCityData.name" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Entrez le nom de la ville" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Pays de la ville</label>
            <select v-model="editCityData.country"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300">
              <option v-for="country in countries" :key="country._id" :value="country._id">{{ country.name }}</option>
            </select>
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
        <p class="text-center mb-6">Êtes-vous sûr de vouloir archiver cette ville ?</p>
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
  </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/layouts/Header.vue";
import CityModal from '@/components/layouts/CityModal.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import { API_URL } from '@/services/config';

export default {
  components: {
    Header,
    CityModal,
    Pagination
  },
  data() {
    return {
      cities: [],
      countries: [],
      showCityModal: false,
      selectedCity: { name: '', countryId: '' },
      selectedCityDetails: null,
      editCityData: null,
      showArchiveConfirmation: false,
      cityToArchive: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      successMessage: '',
      errorMessage: '',
      selectedCountry: null,
    };
  },
  computed: {
    paginatedCities() {
      return this.cities;
    }
  },
  methods: {
    async fetchCities() {
      try {
        const countryId = this.$route.query.countryId;
        const response = await axios.get(`${API_URL}/cities`, {
          params: {
            countryId,
            page: this.currentPage,
            limit: this.itemsPerPage
          }
        });
        this.cities = response.data.cities || [];
        this.totalItems = response.data.totalItems || 0;
        if (this.cities.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.fetchCities();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        this.errorMessage = 'Erreur lors de la récupération des villes';
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchCities();
    },
    openNewCityModal() {
      const countryId = this.$route.query.countryId;
      this.selectedCity = { name: '', countryId };
      this.showCityModal = true;
    },
    editCity(city) {
      this.editCityData = { ...city, country: city.country._id };
    },
    archiveCity(id) {
      this.cityToArchive = id;
      this.showArchiveConfirmation = true;
    },
    cancelArchive() {
      this.showArchiveConfirmation = false;
      this.cityToArchive = null;
    },
    async confirmArchive() {
      try {
        await axios.put(`${API_URL}/cities/${this.cityToArchive}/archive`);
        this.fetchCities();
        this.showArchiveConfirmation = false;
        this.cityToArchive = null;
        this.successMessage = 'Ville archivée avec succès';
      } catch (error) {
        console.error('Erreur lors de l\'archivage de la ville:', error);
        this.showArchiveConfirmation = false;
        this.cityToArchive = null;
        this.errorMessage = 'Erreur lors de l\'archivage de la ville';
      }
    },
    closeCityModal() {
      this.showCityModal = false;
      this.selectedCity = { name: '', countryId: '' };
    },
    closeEditModal() {
      this.editCityData = null;
    },
    async saveCity(city) {
      try {
        const response = await axios.post(`${API_URL}/cities`, city);
        if (response.status === 201) {
          this.fetchCities();
          this.closeCityModal();
          this.successMessage = 'Ville enregistrée avec succès';
        } else {
          console.error('Erreur lors de l\'enregistrement de la ville:', response.data);
          this.errorMessage = 'Erreur lors de l\'enregistrement de la ville';
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la ville:', error);
        this.errorMessage = 'Erreur lors de l\'enregistrement de la ville';
      }
    },
    openFilterOptions() {
      console.log('Options de filtrage ouvertes');
    },
    redirectToDashboard() {
      console.log('Redirection vers le tableau de bord');
    },
    viewCityDetails(city) {
      this.selectedCityDetails = city;
    },
    closeCityDetails() {
      this.selectedCityDetails = null;
    },
    async updateCity() {
      try {
        await axios.put(`${API_URL}/cities/${this.editCityData._id}`, this.editCityData);
        this.fetchCities();
        this.closeEditModal();
        this.successMessage = 'Ville mise à jour avec succès';
      } catch (error) {
        this.closeEditModal();
        console.error('Erreur lors de la mise à jour de la ville:', error);
        this.errorMessage = 'Erreur lors de la mise à jour de la ville';
      }
    },
    async fetchCountries() {
      try {
        const response = await axios.get(`${API_URL}/countries`);
        this.countries = response.data.countries || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error);
      }
    },
    closeSuccessMessage() {
      this.successMessage = '';
    },
    closeErrorMessage() {
      this.errorMessage = '';
    },
    goBack() {
      this.$router.push('/gestionspays');
    },
    async fetchSelectedCountry() {
      try {
        const countryId = this.$route.query.countryId;
        if (countryId) {
          const response = await axios.get(`${API_URL}/countries/${countryId}`);
          this.selectedCountry = response.data;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du pays:', error);
      }
    }
  },
  created() {
    this.fetchCities();
    this.fetchCountries();
    this.fetchSelectedCountry();
  }
};
</script>
