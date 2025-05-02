<template>
  <div class="bg-gray-100 min-h-screen">
    <Header title="NOVA LEAD" primaryActionText="Nouveau produit" @primaryAction="showProductModal = true"
      @filterAction="openFilterOptions" @goToDashboard="redirectToDashboard" />

    <main class="w-full px-4 py-3">
      <h1 class="text-2xl font-bold mb-4">Liste des produits</h1>
      <div class="overflow-x-auto relative overflow-y-hidden">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th class="border border-gray-300 px-4 py-2">Nom</th>
              <th class="border border-gray-300 px-4 py-2">Description</th>
              <th class="border border-gray-300 px-4 py-2">Date de creation</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-normal">
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
              <td class="py-3 px-6 text-center whitespace-nowrap">
                <div class="flex flex-row items-center justify-center space-x-1">
                  <button @click="viewDetails(product)"
                    class="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">Détails</button>
                  <button @click="openEditModal(product)"
                    class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600">Modifier</button>
                  <button @click="confirmArchive(product._id)"
                    class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">Archiver</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Product Modal -->
    <ProductModal v-if="showProductModal" :productToEdit="editProductData" @close="closeProductModal"
      @product-updated="onProductUpdated" />

    <!-- Dialogue pour les détails -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-4">
      <div class="bg-white rounded-lg p-2 sm:p-6 sm:w-2/3 shadow-md relative">
        <h2 class="text-xl font-bold mb-4 text-center">Détails du produit</h2>
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-gray-300 px-4 py-2">Libellé</th>
              <th class="border border-gray-300 px-4 py-2">Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-bold">Nom du produit</td>
              <td class="border border-gray-300 px-4 py-2">{{ selectedProduct.name }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2 font-bold">Description du produit</td>
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
        <button @click="closeDetails"
          class="bg-gray-500 text-white px-4 py-2 mt-6 rounded-md mx-auto block">Fermer</button>
      </div>
    </div>

    <!-- Confirmation d'archivage -->
    <div v-if="confirmArchiveId" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white rounded-lg p-4 w-1/3 shadow-md min-w-max">
        <svg class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p class="text-center m-2">Êtes-vous sûr de vouloir archiver ce produit ?</p>
        <div class="flex justify-center">
          <button @click="archiveProduct" class="bg-red-500 text-white px-4 py-2 rounded-md">Oui, archiver</button>
          <button @click="closeConfirmArchive" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded-md">Annuler</button>
        </div>

      </div>
    </div>

    <!-- Modal d'alerte -->
    <div v-if="alertMessage || errorMessage"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
      <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <div :class="['text-6xl mb-6 text-center', alertMessage ? 'text-green-500' : 'text-red-500']">
          <i :class="alertMessage ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        </div>
        <p class="text-xl mb-6 text-center text-gray-700">
          {{ alertMessage || errorMessage }}
        </p>
        <button @click="closeAlert"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-4 focus:ring-blue-300">
          Fermer
        </button>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />
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
      this.showProductModal = true;
    },
    closeProductModal() {
      this.showProductModal = false;
      this.editProductData = null;
    },
    onProductUpdated({ type, productName }) {
      this.getProducts();
      this.closeProductModal();

      if (type === 'create') {
        this.showAlert(`Le produit ${productName} a été ajouté avec succès`);
      } else {
        this.showAlert(`Le produit ${productName} a été mis à jour avec succès`);
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
    closeAlert() {
      this.alertMessage = null;
      this.errorMessage = null;
    },
    showAlert(message) {
      this.alertMessage = message;
      setTimeout(() => {
        this.closeAlert();
      }, 10000);
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.closeAlert();
      }, 10000);
    },
    goToPage(page) {
      this.currentPage = page;
      this.getProducts();
    },
  },
};
</script>