<template>
    <div>
      <!-- Add City Modal -->
      <div v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      @click.self="closeDropdowns"
      >
        <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
          <div class="relative p-4">
            <!-- Modal header -->
            <div class="flex justify-between items-center pb-4 mb-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Ajouter une ville</h3>
              <button @click="$emit('close')" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
            </div>
  
            <!-- Modal body -->
            <form @submit.prevent="addCity">
              <div class="mb-4">
                <label for="cityName" class="block mb-2 text-sm font-medium text-gray-900">
                  Nom de la Ville  <span class="text-red-500">*</span>
                </label>
                <input v-model="city.name" type="text" id="cityName" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Entez le nom de la ville" required />
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
                    :key="country._id"
                    @click="selectCountry(country)"
                    class="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {{ country.name }}
                  </li>
                </ul>
              </div>
              <button type="submit" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">Ajouter</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Success and Dialogue Messages -->
      <div v-if="successMessage" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75">
        <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
          <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">Succès</h2>
          <p>{{ successMessage }}</p>
          <button @click="closeSuccessMessage" class="bg-green-500 text-white px-8 py-2 mt-4 rounded-md">Fermer</button>
        </div>
      </div>
      <div v-if="errorMessage" class="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75">
        <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
          <h2 class="text-xl font-bold text-red-600 mb-4 text-center">Erreur</h2>
          <p>{{ errorMessage }}</p>
          <button @click="closeErrorMessage" class="bg-red-500 text-white px-8 py-2 mt-4 rounded-md">Fermer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { API_URL } from '@/services/config';
  export default {
    props: ['showModal', 'city'],
    data() {
      return {
        countries: [],
        countrySearch: '',
        showCountryDropdown: false,
        successMessage: '',
        errorMessage: '',
      };
    },
    computed: {
      sortedCountries() {
        return this.countries.sort((a, b) => a.name.localeCompare(b.name));
      },
      filteredCountries() {
        return this.sortedCountries.filter(country =>
          country.name.toLowerCase().includes(this.countrySearch.toLowerCase())
        );
      }
    },
    methods: {
      async addCity() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/cities`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: this.city.name,
              country: this.city.countryId,
              isarchived: false
            }),
          });
  
          if (response.ok) {
            this.successMessage = 'Ville ajoutée avec succès';
            this.resetForm();
            this.$emit('close');
          } else {
            const errorData = await response.json();
            console.error('Failed to add city:', errorData);
            this.errorMessage = 'Failed to add city';
          }
        } catch (error) {
          console.error('Error adding city:', error);
          this.errorMessage = 'An error occurred';
        }
      },
      async fetchCountries() {
        try {
          const response = await fetch(`${API_URL}/countries?limit=0`); // Fetch all countries
          const data = await response.json();
          this.countries = data.countries || [];
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      },
      filterCountries() {
        this.showCountryDropdown = true;
      },
      selectCountry(country) {
        this.city.countryId = country._id;
        this.countrySearch = country.name;
        this.showCountryDropdown = false;
      },
      resetForm() {
        this.$emit('update:city', {
          name: '',
          countryId: '',
        });
        this.countrySearch = '';
      },
      closeSuccessMessage() {
        this.successMessage = '';
      },
      closeErrorMessage() {
        this.errorMessage = '';
      },
      closeDropdowns() {
        this.showCountryDropdown = false;
      }
    },
    created() {
      this.fetchCountries();
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles */
  </style>
