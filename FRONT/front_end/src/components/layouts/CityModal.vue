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
                <label for="city-name" class="block text-sm font-medium text-gray-700">Ville:</label>
                <input 
                  id="city-name" 
                  v-model="city.name" 
                  type="text" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
                  placeholder="Entrez le nom de la ville" 
                  required 
                />
              </div>
              <div class="flex justify-center space-x-4">
                <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition-all">
                  Enregistrer
                </button>
                <button 
                  @click.prevent="$emit('close')" 
                  type="button" 
                  class="bg-gray-500 hover:bg-gray-300 text-black px-6 py-2 rounded-md shadow-md transition-all">
                  Annuler
                </button>
              </div>
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
    props: {
      showModal: {
        type: Boolean,
        required: true
      },
      city: {
        type: Object,
        default: () => ({ name: '', countryId: '' })
      }
    },
    emits: ['close', 'save'],
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
      },
      save() {
        if (this.city.name && this.city.countryId) {
          this.$emit('save', this.city);
          this.$emit('close');  // Fermer le modal après la sauvegarde
        } else {
          this.errorMessage = 'Veuillez remplir tous les champs.';
        }
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
