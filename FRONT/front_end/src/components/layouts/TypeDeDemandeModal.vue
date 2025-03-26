<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
    <div class="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all mx-4">
      <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Modifier' : 'Ajouter' }} un type de demande
          </h3>
          <button
            @click="$emit('close')"
            class="rounded-lg p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nom du type de demande <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="typeDeDemande.name" 
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="Entrez le nom du type de demande"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Description du type de demande
              </label>
              <textarea 
                v-model="typeDeDemande.description" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                rows="4"
                placeholder="Entrez une description"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center pt-4">
            <button 
              type="submit" 
              class="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isEditing ? 'Modifier' : 'Ajouter' }} le type de demande</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/services/config';
import axios from 'axios';

export default {
  props: {
    typeToEdit: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      typeDeDemande: {
        name: '',
        description: ''
      },
      isLoading: false
    };
  },

  computed: {
    isEditing() {
      return !!this.typeToEdit;
    }
  },

  watch: {
    typeToEdit: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.typeDeDemande = { ...newValue };
        }
      }
    }
  },

  methods: {
    async submitForm() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token non trouvé');

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        let response;
        if (this.isEditing) {
          response = await axios.put(
            `${API_URL}/types/${this.typeToEdit._id}`,
            this.typeDeDemande,
            { headers }
          );
        } else {
          response = await axios.post(
            `${API_URL}/types`,
            this.typeDeDemande,
            { headers }
          );
        }

        if (response.status === 200 || response.status === 201) {
          this.$emit('type-updated', {
            type: this.isEditing ? 'update' : 'create',
            typeName: this.typeDeDemande.name
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Custom styles */
</style>
