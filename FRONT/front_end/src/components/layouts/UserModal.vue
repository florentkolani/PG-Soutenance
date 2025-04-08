<template>
  <div>
    <!-- Modal Form -->
    <div
      v-if="!showDialog"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm transition-opacity duration-300"
      @click.self="closeDropdowns"
    >
      <div class="relative w-full max-w-2xl mx-4 transform transition-all duration-300 ease-in-out">
        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div class="p-2 bg-gradient-to-r">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold text-black pl-4">
                {{ isEditing ? 'Modifier' : 'Ajouter' }} un utilisateur
              </h3>
              <button
                @click="$emit('close')"
                class="rounded-full p-2 hover:bg-gray-400 text-black transition-colors duration-200"
                :disabled="isLoading"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="grid gap-4 md:gap-6">
              <!-- Sélecteur de pays -->
              <div>
                <label for="pays" class="block mb-2 text-sm font-medium text-gray-700">
                  Pays <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedCountryCode"
                  id="pays"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                  @change="onCountryChange"
                >
                  <option value="" class="text-gray-400">Sélectionnez un pays</option>
                  <option v-for="country in countries" :key="country.code" :value="country.code" class="text-gray-800">
                    {{ country.name }}
                  </option>
                </select>
              </div>

              <!-- Sélecteur de villes -->
              <div>
                <label for="ville" class="block mb-2 text-sm font-medium text-gray-700">
                  Ville <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.ville"
                  id="ville"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                  :disabled="isLoadingCities || !cities.length"
                >
                  <option value="" class="text-gray-400">Sélectionnez une ville</option>
                  <option v-for="city in cityObjects" :key="city._id" :value="city.name" class="text-gray-800">
                    {{ city.name }}
                  </option>
                </select>
                <div v-if="isLoadingCities" class="mt-2 flex items-center space-x-2">
                  <div class="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-sm text-gray-500">En cours de chargement, veuillez patienter.</span>
                </div>
              </div>

              <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-700">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.name"
                  type="text"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                  placeholder="Entrez votre nom"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-700">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.email"
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                  placeholder="Entrez votre email"
                  required
                  :disabled="isLoading"
                />
              </div>
              
              <div>
                <label for="contact" class="block mb-2 text-sm font-medium text-gray-700">
                  Contact <span class="text-red-500">*</span>
                </label>
                <div class="flex">
                  <!-- Input pour l'indicatif, en lecture seule -->
                  <input
                    type="text"
                    :value="selectedCountryDialCode"
                    class="bg-gray-100 border border-r-0 border-gray-300 text-gray-700 rounded-l-lg block w-1/4 p-2.5"
                    disabled
                  />
                  <!-- Input pour le contact -->
                  <input
                    v-model="user.contact"
                    type="text"
                    id="contact"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 transition duration-200"
                    placeholder="Entrez votre contact"
                    required
                    :disabled="isLoading"
                  />
                </div>
              </div>
              <div>
                <label for="role" class="block mb-2 text-sm font-medium text-gray-700">
                  Role <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.role"
                  id="role"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                  :disabled="isLoading"
                >
                  <option value="Client" class="text-gray-800">Client</option>
                  <option value="Admin" class="text-gray-800">Admin</option>
                  <option value="AgentSupport" class="text-gray-800">Agent Support</option>
                </select>
              </div>
            </div>
            <div class="flex justify-center mt-6">
              <button
                type="submit"
                class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                :disabled="isLoading"
              >
                {{ isEditing ? 'Modifier' : 'Ajouter' }} l'utilisateur
                <svg v-if="isLoading" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out">
        <div :class="['p-6', dialogType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600']">
          <div class="text-6xl mb-4 text-white">
            <i v-if="dialogType === 'success'" class="fas fa-check-circle"></i>
            <i v-else class="fas fa-times-circle"></i>
          </div>
          <p class="text-xl font-medium text-white mb-6">{{ dialogMessage }}</p>
        </div>
        <div class="p-4 bg-gray-50 flex justify-center">
          <button 
            @click="closeDialog" 
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fermer
          </button>
        </div>
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
        paysId: '',
        ville: '',
        villeId: '',
        role: 'Client',
      },
      countries: [],
      cities: [],
      cityObjects: [],
      isLoadingCities: false,
      selectedCountryCode: "",
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
            this.loadCities(country._id);
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
          _id: country._id,
          dialCode: country.code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      console.log("Countries loaded:", this.countries);
    } catch (error) {
      console.error("Erreur lors du chargement des pays :", error);
      this.countries = [];
    }
  },

  methods: {
    async loadCities(countryId) {
      console.log("Country ID:", countryId);

      this.isLoadingCities = true;
      this.cities = [];
      this.cityObjects = [];
      this.user.ville = ''; // Réinitialiser la sélection de la ville

      try {
        if (!countryId) {
          throw new Error('ID de pays manquant');
        }

        // Utiliser le paramètre countryId pour filtrer les villes
        const response = await axios.get(`${API_URL}/cities`, {
          params: {
            countryId: countryId,
            limit: 0
          }
        });

        if (response.data && response.data.cities) {
          this.cityObjects = response.data.cities;
          this.cities = response.data.cities.map(city => city.name);
          console.log("Villes chargées pour le pays:", countryId, this.cityObjects);
        } else {
          console.warn("Aucune ville trouvée pour ce pays");
          this.cityObjects = [];
          this.cities = [];
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error);
        this.cities = [];
        this.cityObjects = [];
      } finally {
        this.isLoadingCities = false;
      }
    },

    filterCountries() {
      const country = this.countries.find(c => c.name.toLowerCase() === this.countrySearch.toLowerCase());
      if (country) {
        this.selectedCountryCode = country.code;
        this.updateCountryName(country._id);
        this.loadCities(country._id);
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
      const country = this.countries.find((c) => c._id === countryId);
      if (country) {
        this.user.pays = country.name;
        this.selectedCountryDialCode = country.dialCode;
      } else {
        this.user.pays = '';
        this.selectedCountryDialCode = '';
      }
    },

    async submitForm() {
      this.isLoading = true;

      try {
        // Vérifier que tous les champs requis sont présents
        if (!this.user.name || !this.user.email || !this.user.contact || !this.user.pays || !this.user.ville) {
          throw new Error('Tous les champs sont requis');
        }

        // Vérifier que les IDs sont présents
if (!this.user.paysId || !this.user.villeId) {
          const country = this.countries.find(c => c.name === this.user.pays);
          if (country) {
            this.user.paysId = country._id;
          } else {
            throw new Error('Pays invalide');
          }
        }

        if (!this.user.villeId) {
          const selectedCity = this.cityObjects.find(city => city.name === this.user.ville);
          if (selectedCity) {
            this.user.villeId = selectedCity._id;
          } else {
            throw new Error('Ville invalide');
          }
        }

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token non trouvé');

        const headers = {
          Authorization: `Bearer ${token}`
        };

        let response;
        if (this.isEditing) {
          response = await axios.put(
            `${API_URL}/users/${this.userToEdit._id}`,
            this.user,
            { headers }
          );
        } else {
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
        console.error('Erreur lors de la soumission du formulaire:', error);
        this.dialogType = 'error';
        this.dialogMessage = `Erreur lors de ${this.isEditing ? 'la modification' : "l'ajout"} de l'utilisateur: ${error.message}`;
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
        paysId: '',
        ville: '',
        villeId: '',
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
      this.updateCountryName(country._id);
      this.loadCities(country._id);
      this.showCountryDropdown = false;
    },
    selectCity(city) {
      this.citySearch = city.name;
      this.user.ville = city.name;
      this.user.villeId = city._id;
      this.showCityDropdown = false;
    },
    closeDropdowns() {
      this.showCountryDropdown = false;
      this.showCityDropdown = false;
    },
    onCountryChange(event) {
      const country = this.countries.find(c => c.code === this.selectedCountryCode);
      if (country) {
        console.log("Pays trouvé:", country);
        this.user.pays = country.name;
        this.user.paysId = country._id;
        this.selectedCountryDialCode = country.dialCode;
        this.user.ville = ''; // Réinitialiser la sélection de la ville
        this.loadCities(country._id);
      } else {
        console.warn("Pays non trouvé pour le code:", this.selectedCountryCode);
      }
    },
  },
};
</script>