<template>
  <div>
    <section v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-0 rounded-lg shadow-lg max-w-lg w-full max-h-[100vh] overflow-y-auto relative">
        <button @click="$emit('close')" 
        class="absolute top-4 right-6 text-red-600 hover:text-gray-700 text-2xl w-10 h-10 flex items-center justify-center">&times;</button>

        <div class="py-4 px-6">
          <h2 class="mb-4 text-xl font-bold text-gray-900 text-center">
            {{ isEdit ? "Modifier le Ticket" : "Créer un Ticket" }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <!-- Product Select -->
              <div class="sm:col-span-2">
                <label for="product" class="block mb-2 text-sm font-medium text-gray-900">
                  Produit <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedProduct"
                  id="product"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">Sélectionner un produit</option>
                  <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
                </select>
              </div>

              <!-- Type de Demande Select -->
              <div class="sm:col-span-2">
                <label for="typeDeDemande" class="block mb-2 text-sm font-medium text-gray-900">
                  Type de Demande <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedTypeDeDemande"
                  id="typeDeDemande"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">Sélectionner un type de demande</option>
                  <option v-for="type in typeDeDemandes" :key="type._id" :value="type._id">{{ type.name }}</option>
                </select>
              </div>

              <!-- Urgency, Description, and File Upload -->
              <div>
                <label for="urgence" class="block mb-2 text-sm font-medium text-gray-900">
                  Urgence <span class="text-red-500">*</span>
                </label>
                <select v-model="urgence" id="urgence" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg">
                  <option value="">Sélectionnez l'Urgence</option>
                  <option value="urgent">Urgent</option>
                  <option value="Pas Urgent">Pas Urgent</option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="description"
                  id="description"
                  rows="2"
                  required
                  class="block w-full text-sm bg-gray-50 rounded-lg border"
                ></textarea>
              </div>
              <div class="sm:col-span-2">
                <label for="screenshot" class="block mb-2 text-sm font-medium text-gray-900">
                  Télécharger un fichier (optionnel)
                </label>
                <input
                  type="file"
                  @change="handleFileChange"
                  id="screenshot"
                  class="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                />
              </div>
            </div>
            <div class="flex justify-center">
              <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
                <button
                  type="submit"
                  class="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-black bg-green-300 rounded-lg hover:bg-green-800 disabled:opacity-50"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Chargement..." : (isEdit ? "Modifier le ticket" : "Créer un ticket") }}
                </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Boîte de dialogue de succès -->
    <div v-if="showSuccessMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full text-center">
        <h3 class="text-xl font-bold mb-4">Succès</h3>
        <p>{{ successMessage }}</p>
        <button @click="closeSuccessDialog" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          OK
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    ticket: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'createTicket', 'updateTicket', 'refreshData'],
  data() {
    return {
      products: [],
      typeDeDemandes: [],
      selectedProduct: '',
      selectedTypeDeDemande: '',
      urgence: '',
      description: '',
      status: 'ouvert',
      file: null,
      showSuccessMessage: false,
      successMessage: '',
      isLoading: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.ticket;
    },
  },
  watch: {
    ticket: {
      immediate: true,
      handler(ticket) {
        this.loadProductsAndTypes(); // Ensure products and types are loaded first
        if (ticket) {
          this.selectedProduct = ticket.product ? ticket.product._id : '';
          this.selectedTypeDeDemande = ticket.typeDeDemande ? ticket.typeDeDemande._id : '';
          this.urgence = ticket.urgence;
          this.description = ticket.description;
        } else {
          this.resetFields();
        }
      },
    },
  },
  mounted() {
    this.loadProductsAndTypes();
  },
  methods: {
    resetFields() {
      this.selectedProduct = '';
      this.selectedTypeDeDemande = '';
      this.urgence = '';
      this.description = '';
      this.file = null;
    },
    loadProductsAndTypes() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("L'utilisateur n'est pas connecté");
    return;
  }

  // Chargement des produits
  axios.get(`${API_URL}/products`, 
  { headers: { Authorization: `Bearer ${token}` } })
    .then(response => { 
      if (!Array.isArray(response.data)) {  // Vérification directe de response.data
        console.error("Données produits invalides :", response.data);
        this.products = [];
      } else {
        this.products = response.data;  // Utilisation de response.data directement
      }
    })
    .catch(error => console.error("Erreur lors du chargement des produits :", error));

  // Chargement des types de demandes
  axios.get(`${API_URL}/types`, 
  { headers: { Authorization: `Bearer ${token}` } })
    .then(response => {
      this.typeDeDemandes = response.data.types || [];
    })
    .catch(error => console.error("Erreur lors du chargement des types de demandes :", error));
}
,
    handleSubmit() {
      if (!this.selectedProduct || !this.selectedTypeDeDemande || !this.urgence || !this.description) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert("L'utilisateur n'est pas connecté");
        return;
      }

      let userId;
      try {
        userId = JSON.parse(atob(token.split('.')[1])).id;
      } catch (error) {
        console.error("Erreur lors de la récupération de userId :", error);
        alert("Erreur lors de la récupération de userId");
        return;
      }

      const apiEndpoint = this.isEdit ? `${API_URL}/tickets/${this.ticket._id}` : `${API_URL}/tickets`;
      const method = this.isEdit ? 'put' : 'post';

      const data = new FormData();
      data.append('productId', this.selectedProduct);
      data.append('typeDeDemandeId', this.selectedTypeDeDemande);
      data.append('urgence', this.urgence);
      data.append('description', this.description);
      data.append('status', this.status);
      data.append('userId', userId);
      if (this.file) {
        data.append('file', this.file);
      }

      // Activation de l'indicateur de chargement
    this.isLoading = true;

      axios({
        method,
        url: apiEndpoint,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          this.successMessage = this.isEdit ? "Ticket mis à jour avec succès !" : "Ticket créé avec succès !";
          this.$emit('close');
          this.showSuccessMessage = true;
          
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi des données :", error.response?.data || error.message);
          alert(`Erreur : ${error.response?.data?.message || 'Erreur inconnue'}`);
        })
        .finally(() => {
        this.isLoading = false; // Désactivation de l'indicateur de chargement
        this.$emit('refreshData');
      });
    },

    handleFileChange(event) {
      this.file = event.target.files[0];
    },

    closeSuccessDialog() {
      this.showSuccessMessage = false;
      setTimeout(() => {
    location.reload();
  }, 5000); 
    },
  },
};
</script>

