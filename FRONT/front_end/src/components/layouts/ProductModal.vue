<template>
  <div>
    <!-- Add Product Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="relative p-4">
          <div class="flex justify-between items-center pb-4 mb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Ajoutez un nouveau produit</h3>
            <button @click="closeModal" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="addProduct">
            <div class="mb-4">
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
                Nom du produit <span class="text-red-500">*</span>
              </label>
              <input v-model="product.name" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Entrez le nom du produit" required />
            </div>
            
            <div class="mb-4">
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Description du produit</label>
              <textarea v-model="product.description" id="description" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Entrez la description du produit "></textarea>
            </div>

            <button type="submit" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">
              <span v-if="isLoading" class="loader-spinner mr-2"></span> <!-- Spinner ajoutée ici -->
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Dialog for success/error messages -->
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-md bg-white rounded-lg shadow">
        <div class="text-center p-4">
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
  </div>
</template>

<script>
import { API_URL } from '@/services/config';
export default {
  props: ['showModal'],
  data() {
    return {
      product: {
        name: '',
        description: '',
      },
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
      isLoading: false, // Variable pour suivre l'état du spinner
    };
  },
  methods: {
    async addProduct() {
      this.isLoading = true; // Afficher le spinner

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.product),
        });

        if (response.ok) {
             // Fermer le modal après avoir la reponse du serveur
          this.closeModal();
          this.dialogType = 'success';
          this.dialogMessage = 'Produit enregistrer avec succès';
          this.showDialog = true;
          this.resetForm();
          this.$emit('product-added'); // Émet un événement pour rafraîchir la liste des produits
        } else {
          this.dialogType = 'error';
          this.dialogMessage = "Erreur d'enregistrement du produit" ;
          this.showDialog = true;
        }
      } catch (error) {
        console.error('Error adding product:', error);
        this.dialogType = 'error';
        this.dialogMessage = 'An error occurred';
        this.showDialog = true;
      } finally {
        this.isLoading = false; 
      }
    },
    closeDialog() {
      this.showDialog = false;
      this.$emit('close'); // Ferme le modal principal après la fermeture du message de succès
    },
    closeModal() {
      this.$emit('close'); // Ferme le modal d'ajout de produit
    },
    resetForm() {
      this.product = {
        name: '',
        description: '',
      };
    },
  },
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
