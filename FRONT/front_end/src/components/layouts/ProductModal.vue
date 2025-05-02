<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
    <div class="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all mx-4">
      <div class="p-6">
        <div class="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-black pl-4">
            {{ isEditing ? 'Modifier' : 'Ajouter' }} un produit
          </h3>
          <button @click="$emit('close')"
            class="rounded-lg p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nom du produit <span class="text-red-500">*</span>
              </label>
              <input v-model="product.name" type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="Entrez le nom du produit" required />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Description du produit
              </label>
              <textarea v-model="product.description"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                rows="4" placeholder="Entrez une description"></textarea>
            </div>
          </div>

          <div class="flex justify-center pt-4">
            <button type="submit"
              class="w-full sm:w-auto px-8 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              :disabled="isLoading">
              <span v-if="isLoading"
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isEditing ? 'Modifier' : 'Ajouter' }} le produit</span>
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
    productToEdit: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      product: {
        name: '',
        description: ''
      },
      isLoading: false
    };
  },

  computed: {
    isEditing() {
      return !!this.productToEdit;
    }
  },

  watch: {
    productToEdit: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.product = { ...newValue };
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
            `${API_URL}/products/${this.productToEdit._id}`,
            this.product,
            { headers }
          );
        } else {
          response = await axios.post(
            `${API_URL}/products`,
            this.product,
            { headers }
          );
        }

        if (response.status === 200 || response.status === 201) {
          this.$emit('product-updated', {
            type: this.isEditing ? 'update' : 'create',
            productName: this.product.name
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
.loader-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
