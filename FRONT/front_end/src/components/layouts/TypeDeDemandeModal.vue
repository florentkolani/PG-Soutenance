<template>
  <div>
    <!-- Add Type de Demande Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="relative p-4">
          <!-- Modal header -->
          <div class="flex justify-between items-center pb-4 mb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Ajoutez type de demande</h3>
            <button @click="$emit('close')" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
          </div>

          <!-- Modal body -->
          <form @submit.prevent="addTypeDeDemande">
            <div class="mb-4">
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
                Nom du type de demande  <span class="text-red-500">*</span>
              </label>
              <input v-model="typeDeDemande.name" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Entrez le nom type de demande" required />
            </div>
            <div class="mb-4">
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Description du type de demande</label>
              <textarea v-model="typeDeDemande.description" id="description" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Entrez la description du type de demande"></textarea>
            </div>
            <button type="submit" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">Ajouter</button>
          </form>
        </div>
      </div>
    </div>
    
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-5 rounded-lg shadow-xl text-center">
        <div :class="['text-6xl mb-4', dialogType === 'success' ? 'text-green-500' : 'text-red-500']">
          <i v-if="dialogType === 'success'" class="fas fa-check-circle"></i>
          <i v-else class="fas fa-times-circle"></i>
        </div>
        <p class="text-xl mb-4">{{ dialogMessage }}</p>
        <button @click="closeDialog" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/services/config';
export default {
  props: ['showModal'],
  data() {
    return {
      typeDeDemande: {
        name: '',
        description: '',
      },
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
    };
  },
  methods: {
    async addTypeDeDemande() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/types`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.typeDeDemande),
        });

        if (response.ok) {
          this.dialogType = 'success';
          this.dialogMessage = 'Type de Demande added successfully';
          this.showDialog = true;
          this.resetForm();
          this.$emit('close');
        } else {
          this.dialogType = 'error';
          this.dialogMessage = 'Failed to add Type de Demande';
          this.showDialog = true;
        }
      } catch (error) {
        console.error('Error adding type de demande:', error);
        this.dialogType = 'error';
        this.dialogMessage = 'An error occurred';
        this.showDialog = true;
      }
    },
    closeDialog() {
      this.showDialog = false;
    },
    resetForm() {
      this.typeDeDemande = {
        name: '',
        description: '',
      };
    },
  },
};
</script>

<style scoped>
/* Custom styles */
</style>
