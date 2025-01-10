<template>
    <div>
      <!-- Add City Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
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
              <div class="mb-4">
                <label for="countryId" class="block mb-2 text-sm font-medium text-gray-900">
                  Le pays <span class="text-red-500">*</span>
                </label>
                <select v-model="city.countryId" id="countryId" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" required>
                  <option v-for="country in countries" :key="country._id" :value="country._id">{{ country.name }}</option>
                </select>
              </div>
              <button type="submit" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">Ajouter</button>
            </form>
          </div>
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
        countries: []
      };
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
              country: this.city.countryId
            }),
          });
  
          if (response.ok) {
            alert('City added successfully');
            this.resetForm();
            this.$emit('close');
          } else {
            const errorData = await response.json();
            console.error('Failed to add city:', errorData);
            alert('Failed to add city');
          }
        } catch (error) {
          console.error('Error adding city:', error);
          alert('An error occurred');
        }
      },
      async fetchCountries() {
        try {
          const response = await fetch(`${API_URL}/countries`);
          const data = await response.json();
          this.countries = data.countries || [];
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      },
      resetForm() {
        this.$emit('update:city', {
          name: '',
          countryId: '',
        });
      },
    },
    created() {
      this.fetchCountries();
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles */
  </style>
