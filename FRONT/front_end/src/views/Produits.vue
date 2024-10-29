<template>
  <div class="bg-gray-100 min-h-screen">
    <header class="bg-lime-500 p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="../assets/logo.png" alt="Logo" class="h-10" />
          <span class="text-white text-xl font-bold">NOVA Lead</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="showProductModal = true" class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition">
            Nouveau <span class="ml-1">+</span>
          </button>
          <button class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition flex items-center">
            Filtrer
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des Produits</h1>
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Nom</th>
            <th class="border border-gray-300 px-4 py-2">Description</th>
            <th class="border border-gray-300 px-4 py-2">Date de Creation</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="product in products" :key="product._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2">{{ product.name }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ product.description }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ new Date(product.createdAt).toLocaleDateString() }}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              <button @click="viewDetails(product)" class="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600">Détails</button>
              <button @click="openEditModal(product)" class="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Modifier</button>
              <button @click="confirmArchive(product._id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Archiver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <!-- Product Modal -->
    <ProductModal :showModal="showProductModal" @close="showProductModal = false" @product-added="getProducts" />

    <!-- Dialogue pour les détails -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center text-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-2">Détails du Produit</h2>
        <p><strong>ID:</strong> {{ selectedProduct._id }}</p>
        <p><strong>Nom:</strong> {{ selectedProduct.name }}</p>
        <p><strong>Description:</strong> {{ selectedProduct.description }}</p>
        <p><strong>Date de Création:</strong> {{ new Date(selectedProduct.createdAt).toLocaleDateString() }}</p>
        <button @click="closeDetails" class="bg-gray-500 text-white px-4 py-2 mt-4 rounded-md">Fermer</button>
      </div>
    </div>

    <!-- Dialogue pour l'édition -->
    <div v-if="editProductData" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-2">Modifier le Produit</h2>
        <form @submit.prevent="updateProduct">
          <div class="mb-4">
            <label class="block text-gray-700">Nom:</label>
            <input v-model="editProductData.name" type="text" class="w-full px-4 py-2 border rounded-md" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Description:</label>
            <textarea v-model="editProductData.description" class="w-full px-4 py-2 border rounded-md"></textarea>
          </div>
          <div class="flex justify-center">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Enregistrer</button>
          <button @click="closeEditModal" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
          </div>
          
        </form>
      </div>
    </div>

    <!-- Confirmation de suppression -->
    <div v-if="confirmArchiveId" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-4">Archiver le Produit</h2>
        <p>Êtes-vous sûr de vouloir archiver ce produit ?</p>
        <div class="flex justify-center">
          <button @click="archiveProduct" class="bg-red-500 text-white px-4 py-2 rounded-md">Oui, archiver</button>
        <button @click="closeConfirmArchive" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
        </div>
        
      </div>
    </div>

    <!-- Alertes -->
    <div v-if="alertMessage" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
      {{ alertMessage }}
      <button @click="alertMessage = null" class="ml-2 text-sm">X</button>
    </div>
    <div v-if="errorMessage" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md">>
      {{ errorMessage }}
      <button @click="errorMessage = null" class="ml-2 text-sm">X</button>
    </div>
  </div>
</template>

<script>
import ProductModal from '@/components/layouts/ProductModal.vue';

export default {
  name: 'Produits',
  components: {
    ProductModal,
  },
  data() {
    return {
      showProductModal: false,
      products: [],
      selectedProduct: null,
      editProductData: null,
      confirmArchiveId: null,
      alertMessage: null,
      errorMessage: null,
    };
  },
  methods: {
    getToken() {
      return localStorage.getItem('token');
    },

    checkAuthorization() {
      const token = this.getToken();
      if (!token) {
        console.error("Token manquant. Redirection vers la page de connexion.");
        this.$router.push('/login');
        return false;
      }
      return token;
    },

    async getProducts() {
      const token = this.checkAuthorization();
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          this.products = await response.json();
        } else if (response.status === 401) {
          console.error("Non autorisé. Redirection vers la page de connexion.");
          this.$router.push('/login');
        } else {
          console.error("Erreur lors de la récupération des produits.");
          this.showError("Erreur lors de la récupération des produits.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        this.showError("Erreur réseau. Veuillez réessayer.");
      }
    },

    viewDetails(product) {
      this.selectedProduct = product;
    },

    closeDetails() {
      this.selectedProduct = null;
    },

    openEditModal(product) {
      this.editProductData = { ...product };
    },

    closeEditModal() {
      this.editProductData = null;
    },

    async updateProduct() {
      const token = this.checkAuthorization();
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/products/${this.editProductData._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.editProductData),
        });

        if (response.ok) {
          this.showAlert("Produit mis à jour avec succès.");
          this.getProducts();
          this.closeEditModal();
        } else if (response.status === 401) {
          console.error("Non autorisé. Redirection vers la page de connexion.");
          this.$router.push('/login');
        } else {
          console.error("Erreur lors de la mise à jour du produit.");
          this.showError("Erreur lors de la mise à jour du produit.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        this.showError("Erreur réseau. Veuillez réessayer.");
      }
    },

    confirmArchive(productId) {
      this.confirmArchiveId = productId;
    },

    closeConfirmArchive() {
      this.confirmArchiveId = null;
    },

    async archiveProduct() {
      const token = this.checkAuthorization();
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/products/${this.archiveProduct}/archive`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          this.showAlert("Produit archivé avec succès.");
          this.getProducts();
          this.closeConfirmArchive();
        } else if (response.status === 401) {
          console.error("Non autorisé. Redirection vers la page de connexion.");
          this.$router.push('/login');
        } else {
          console.error("Erreur lors de l'archivage du produit.");
          this.showError("Erreur lors de l'archivage du produit.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        this.showError("Erreur réseau. Veuillez réessayer.");
      }
    },

    // Nouvelle méthode pour afficher un message d'alerte
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = null;
      }, 3000); // Disparaît après 3 secondes
    },

    // Nouvelle méthode pour afficher un message d'erreur
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000); // Disparaît après 3 secondes
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>


<style scoped>
/* Ajoutez vos styles personnalisés ici si nécessaire */
</style>
