<template>
  <div class="bg-gray-100 min-h-screen">
    <Header 
      title="NOVA LEAD" 
      primaryActionText="Nouveau produit" 
      @primaryAction="showProductModal = true" 
      @filterAction="openFilterOptions" 
       @goToDashboard="redirectToDashboard"
    />

    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des produits</h1>
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Nom</th>
            <th class="border border-gray-300 px-4 py-2">Description</th>
            <th class="border border-gray-300 px-4 py-2">Date de creation</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="product in products" :key="product._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class=" px-4 py-2">{{ product.name }}</td>
            <td class="px-4 py-2"> {{ truncateText(product.description, 50) }}</td>
            <td class="border px-4 py-2 text-center">
              {{ new Date(product.createdAt).toLocaleString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
              }) }}
            </td>
            <td class=" px-4 py-2 text-center">
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
   <div v-if="selectedProduct" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
  <div class="bg-white rounded-lg p-6 w-2/3 shadow-md relative">
    <h2 class="text-xl font-bold mb-4 text-center">Détails du Produit</h2>
    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200 text-left">
          <th class="border border-gray-300 px-4 py-2">Champ</th>
          <th class="border border-gray-300 px-4 py-2">Valeur</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-gray-300 px-4 py-2 font-bold">Nom</td>
          <td class="border border-gray-300 px-4 py-2">{{ selectedProduct.name }}</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-2 font-bold">Description</td>
          <td class="border border-gray-300 px-4 py-2">{{ selectedProduct.description }}</td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-4 py-2 font-bold">Date de Création</td>
          <td class="border border-gray-300 px-4 py-2">
            {{ new Date(selectedProduct.createdAt).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="closeDetails" class="bg-gray-500 text-white px-4 py-2 mt-6 rounded-md mx-auto block">Fermer</button>
  </div>
</div>


    <!-- Dialogue pour l'édition -->
<div v-if="editProductData" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Modifier le Produit</h2>
    <form @submit.prevent="updateProduct">
      <!-- Champ Nom -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Nom :</label>
        <input 
          v-model="editProductData.name" 
          type="text" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez le nom du produit"
        />
      </div>
      <!-- Champ Description -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Description :</label>
        <textarea 
          v-model="editProductData.description" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
          placeholder="Entrez une description"
        ></textarea>
      </div>
      <!-- Boutons -->
      <div class="flex justify-center space-x-4">
        <button 
          type="submit" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition-all"
        >
          Enregistrer
        </button>
        <button 
          @click="closeEditModal" 
          type="button" 
          class="bg-gray-500 hover:bg-gray-300 text-black px-6 py-2 rounded-md shadow-md transition-all"
        >
          Annuler
        </button>
      </div>
    </form>
  </div>
</div>


    <!-- Confirmation d'archivage -->
    <div v-if="confirmArchiveId" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md">
        <h2 class="text-xl font-bold mb-4 text-center">Archiver le Produit</h2>
        <p class="text-center m-2">Êtes-vous sûr de vouloir archiver ce produit ?</p>
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

  <!-- Pagination -->
 <Pagination
        :total-items="totalItems" 
        :items-per-page="itemsPerPage" 
        @page-changed="goToPage" 
      />
</template>

<script>
import ProductModal from '@/components/layouts/ProductModal.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import Header from "@/components/layouts/Header.vue";
import GoToDashboard from '@/components/layouts/GoToDashboard.vue';
import { API_URL } from '@/services/config';
export default {
  name: 'Produits',
  components: {
    ProductModal,
    Pagination,
    Header,
    GoToDashboard,
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
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
    };
  },

  mounted() {
    this.getProducts();
    this.interval = setInterval(() => {
      this.getProducts();
    }, 1000);
  },

  methods: {
    redirectToDashboard() {
      this.$router.push('/dashboard'); // Redirection vers la route du dashboard
    },
    getToken() {
      return localStorage.getItem('token');
    },

    openFilterOptions() {
      // Logic for filtering products
    },

    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + '...';
      }
      return text;
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
      try {
        const token = this.checkAuthorization();
        if (!token) return;

        const response = await fetch(`${API_URL}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Trier les produits par ordre alphabétique (en fonction du nom ou du label)
          const sortedProducts = data.sort((a, b) => {
            const nameA = (a.name ?? '').toUpperCase(); // Utiliser le champ 'name' (ou 'label' si applicable)
            const nameB = (b.name ?? '').toUpperCase(); // Utiliser le champ 'name' (ou 'label' si applicable)
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });

          // Assigner les produits triés
          this.products = sortedProducts;
        } else if (response.status === 401) {
          console.error("Non autorisé. Redirection vers la page de connexion.");
          this.$router.push('/login');
        } else {
          console.error("Erreur lors du chargement des produits.");
          this.showError("Erreur lors du chargement des produits.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        this.showError("Erreur réseau. Veuillez réessayer.");
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getProducts();
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
        const response = await fetch(`${API_URL}/products/${this.editProductData._id}`, {
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
    const response = await fetch(`${API_URL}/products/${this.confirmArchiveId}/archive`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      this.showAlert("Produit archivé avec succès.");
      await this.getProducts(); // Recharge les produits après l'archivage
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
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.alertMessage = null;
      }, 3000); // Disparaît après 3 secondes
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000); // Disparaît après 3 secondes
    },
    goToPage(page) {
      this.currentPage = page;
      this.getProducts(); 
    },
  },
};
</script>