<template>
  <div>
    <!-- Modal Form -->
    <div
      v-if="!showDialog"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm"
      @click.self="closeDropdowns"
    >
      <div class="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        <div class="p-6">
          <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">
              {{ isEditing ? 'Modifier' : 'Ajouter' }} un utilisateur
            </h3>
            <button
              @click="$emit('close')"
              class="rounded-lg p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              :disabled="isLoading"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitForm">
            <div class="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.name"
                  type="text"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Entrez votre nom"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.email"
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Entrez votre email"
                  required
                  :disabled="isLoading"
                />
              </div>
              <!-- Sélecteur de pays avec recherche -->
              <div class="mb-4 relative">
                <label for="pays" class="block text-sm font-medium text-gray-900 mb-2">
                  Pays <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="countrySearch"
                  placeholder="Rechercher ou sélectionner un pays"
                  class="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-2"
                  @input="filterCountries"
                  @focus="showCountryDropdown = true"
                  required
                />
                <ul v-if="showCountryDropdown && filteredCountries.length" class="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                  <li
                    v-for="country in filteredCountries"
                    :key="country.code"
                    @click="selectCountry(country)"
                    class="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {{ country.name }}
                  </li>
                </ul>
              </div>

              <!-- Sélecteur de villes avec recherche -->
              <div class="mb-4 relative">
                <label for="ville" class="block text-sm font-medium text-gray-900 mb-2">
                  Ville <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="citySearch"
                  placeholder="Rechercher ou sélectionner une ville"
                  class="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 mb-2"
                  @input="filterCities"
                  @focus="showCityDropdown = true"
                  :disabled="isLoadingCities || !cities.length"
                  required
                />
                <ul v-if="showCityDropdown && filteredCities.length" class="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-60 overflow-auto">
                  <li
                    v-for="city in filteredCities"
                    :key="city"
                    @click="selectCity(city)"
                    class="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {{ city }}
                  </li>
                </ul>
                <div v-if="isLoadingCities" class="mt-2 flex items-center space-x-2">
                  <div class="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-sm text-gray-500">En cours de chargement, veuillez patienter.</span>
                </div>
              </div>

              <div>
                <label for="contact" class="block mb-2 text-sm font-medium text-gray-900">
                  Contact <span class="text-red-500">*</span>
                </label>
                <div class="flex">
                  <!-- Input pour l'indicatif, en lecture seule -->
                  <input
                    type="text"
                    :value="selectedCountryDialCode"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-l-lg block w-1/4 p-2.5"
                    disabled
                  />
                  <!-- Input pour le contact -->
                  <input
                    v-model="user.contact"
                    type="text"
                    id="contact"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-r-lg block w-3/4 p-2.5"
                    placeholder="Entrez votre contact"
                    required
                    :disabled="isLoading"
                  />
                </div>
              </div>
              <div>
                <label for="role" class="block mb-2 text-sm font-medium text-gray-900">
                  Role <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.role"
                  id="role"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  :disabled="isLoading"
                >
                  <option value="Client">Client</option>
                  <option value="Admin">Admin</option>
                  <option value="AgentSupport">Agent Support</option>
                </select>
              </div>
            </div>
            <div class="flex justify-center">
              <button
                type="submit"
                class="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-200"
                :disabled="isLoading"
              >
                {{ isEditing ? 'Modifier' : 'Ajouter' }} l'utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-5 rounded-lg shadow-xl text-center">
        <div :class="['text-6xl mb-4', dialogType === 'success' ? 'text-green-500' : 'text-red-500']">
          <i v-if="dialogType === 'success'" class="fas fa-check-circle"></i>
          <i v-else class="fas fa-times-circle"></i>
        </div>
        <p class="text-xl mb-4">{{ dialogMessage }}</p>
        <button @click="closeDialog" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  props: {
    userToEdit: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      user: {
        name: '',
        email: '',
        contact: '',
        pays: '',
        ville: '',
        role: 'Client',
      },
      countries: [],
      cities: [],
      isLoadingCities: false,
      selectedCountryCode: "default",
      selectedCountryDialCode: "",
      isLoading: false,
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
      countrySearch: '',
      citySearch: '',
      showCountryDropdown: false,
      showCityDropdown: false,
    };
  },

  computed: {
    isEditing() {
      return !!this.userToEdit;
    },
    filteredCountries() {
      return this.countries.filter(country =>
        country.name.toLowerCase().includes(this.countrySearch.toLowerCase())
      );
    },
    filteredCities() {
      return this.cities.filter(city =>
        city.toLowerCase().includes(this.citySearch.toLowerCase())
      );
    },
  },

  watch: {
    userToEdit: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          // Pré-remplir le formulaire avec les données de l'utilisateur
          this.user = { ...newValue };
          this.countrySearch = newValue.pays;
          this.citySearch = newValue.ville;
          
          // Trouver et sélectionner le pays
          const country = this.countries.find(c => c.name === newValue.pays);
          if (country) {
            this.selectedCountryCode = country.code;
            this.selectedCountryDialCode = country.dialCode;
            this.loadCities(country.code);
          }
        }
      }
    }
  },

  async created() {
    // Fetch countries from the database
    try {
      const response = await axios.get(`${API_URL}/countries?limit=0`);
      this.countries = response.data.countries
        .map((country) => ({
          name: country.name,
          code: country.code,
          dialCode: country.code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort countries alphabetically
    } catch (error) {
      console.error("Erreur lors du chargement des pays :", error);
      this.countries = [];
    }
  },

  methods: {
    async loadCities(countryId) {
      console.log("Country ID:", countryId); // Vérification de l'ID envoyé

      this.isLoadingCities = true;
      this.cities = [];

      try {
        const url = countryId ? `${API_URL}/cities?country=${countryId}&limit=0` : `${API_URL}/cities?limit=0`;
        const response = await axios.get(url);
        this.cities = response.data.cities
          .map((city) => city.name)
          .sort((a, b) => a.localeCompare(b)); // Sort cities alphabetically
        console.log("Cities loaded:", this.cities); // Vérification des villes chargées
      } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error);
        this.cities = [];
      } finally {
        this.isLoadingCities = false;
      }
    },

    filterCountries() {
      const country = this.countries.find(c => c.name.toLowerCase() === this.countrySearch.toLowerCase());
      if (country) {
        this.selectedCountryCode = country.code;
        this.updateCountryName(country.code);
        this.loadCities(country.code);
      }
    },

    filterCities() {
      const city = this.cities.find(c => c.toLowerCase() === this.citySearch.toLowerCase());
      if (city) {
        this.user.ville = city;
      }
    },

    // Mettre à jour le nom du pays sélectionné et son code d'appel
    updateCountryName(countryId) {
      const country = this.countries.find((c) => c.code === countryId);
      if (country) {
        this.user.pays = country.name;
        this.selectedCountryDialCode = country.dialCode || ''; // Pré-remplir le code pays
      } else {
        this.user.pays = '';
        this.selectedCountryDialCode = '';
      }
    },

    async submitForm() {
      this.isLoading = true;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token non trouvé');

        const headers = {
          Authorization: `Bearer ${token}`
        };

        let response;
        if (this.isEditing) {
          // Mise à jour
          response = await axios.put(
            `${API_URL}/users/${this.userToEdit._id}`,
            this.user,
            { headers }
          );
        } else {
          // Création
          response = await axios.post(
            `${API_URL}/auth/register`,
            this.user,
            { headers }
          );
        }

        if (response.status === 200 || response.status === 201) {
          this.dialogType = 'success';
          this.dialogMessage = `Utilisateur ${this.isEditing ? 'modifié' : 'ajouté'} avec succès`;
          this.showDialog = true;
          this.$emit('user-updated');
        }
      } catch (error) {
        this.dialogType = 'error';
        this.dialogMessage = `Erreur lors de ${this.isEditing ? 'la modification' : "l'ajout"} de l'utilisateur`;
        this.showDialog = true;
      } finally {
        this.isLoading = false;
      }
    },

    closeDialog() {
      this.showDialog = false;
      this.$emit('close');
    },

    resetForm() {
      this.user = {
        name: '',
        email: '',
        contact: '',
        pays: '',
        ville: '',
        role: 'Client',
      };
      this.selectedCountryDialCode = '';
      this.countrySearch = '';
      this.citySearch = '';
      this.showCountryDropdown = false;
      this.showCityDropdown = false;
    },

    selectCountry(country) {
      this.countrySearch = country.name;
      this.selectedCountryCode = country.code;
      this.updateCountryName(country.code);
      this.loadCities(country.code);
      this.showCountryDropdown = false;
    },
    selectCity(city) {
      this.citySearch = city;
      this.user.ville = city;
      this.showCityDropdown = false;
    },
    closeDropdowns() {
      this.showCountryDropdown = false;
      this.showCityDropdown = false;
    },
  },
};
</script>