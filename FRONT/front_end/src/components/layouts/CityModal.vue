<template>
    <div>
      <!-- Add City Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
          <div class="relative p-4">
            <!-- Modal header -->
            <div class="flex justify-between items-center pb-4 mb-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Add City</h3>
              <button @click="$emit('close')" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
            </div>
  
            <!-- Modal body -->
            <form @submit.prevent="addCity">
              <div class="mb-4">
                <label for="cityName" class="block mb-2 text-sm font-medium text-gray-900">
                  City Name <span class="text-red-500">*</span>
                </label>
                <input v-model="city.name" type="text" id="cityName" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Enter city name" required />
              </div>
              <div class="mb-4">
                <label for="countryId" class="block mb-2 text-sm font-medium text-gray-900">
                  Country ID <span class="text-red-500">*</span>
                </label>
                <input v-model="city.countryId" type="text" id="countryId" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Enter country ID" required />
              </div>
              <button type="submit" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['showModal'],
    data() {
      return {
        city: {
          name: '',
          countryId: '',
        },
      };
    },
    methods: {
      async addCity() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/cities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(this.city),
          });
  
          if (response.ok) {
            alert('City added successfully');
            this.resetForm();
            this.$emit('close');
          } else {
            alert('Failed to add city');
          }
        } catch (error) {
          console.error('Error adding city:', error);
          alert('An error occurred');
        }
      },
      resetForm() {
        this.city = {
          name: '',
          countryId: '',
        };
      },
    },
  };
  </script>
  
  <style scoped>
  /* Custom styles */
  </style>
  