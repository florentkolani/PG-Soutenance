<template>
  <section
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-white p-0 rounded-lg shadow-lg max-w-lg w-full max-h-[100vh] overflow-y-auto relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-6 text-red-600 hover:text-gray-700"
      >
        &times;
      </button>

      <div class="py-4 px-6">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white text-center">
          {{ isEdit ? "Modifier le Ticket" : "Créer un Ticket" }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
              <label for="product" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Produit</label>
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

            <div class="sm:col-span-2">
              <label for="typeDeDemande" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type de Demande</label>
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

            <div>
              <label for="urgence" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Urgence</label>
              <select
                v-model="urgence"
                id="urgence"
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              >
                <option value="">Sélectionnez l'Urgence</option>
                <option value="urgent">Urgent</option>
                <option value="Pas Urgent">Pas Urgent</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
              <textarea
                v-model="description"
                id="description"
                rows="2"
                required
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <div class="sm:col-span-2">
              <label for="screenshot" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Télécharger un fichier</label>
              <input
                type="file"
                @change="handleFileChange"
                id="screenshot"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>
          </div>
          <div class="flex justify-center">
            <button
              type="submit"
              class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-black bg-primary-700 rounded-lg hover:bg-green-800 bg-green-300"
            >
              {{ isEdit ? "Modifier le ticket" : "Créer un ticket" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

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
        if (ticket) {
          this.selectedProduct = this.products.find(product => product._id === ticket.productId)?._id || '';
          this.selectedTypeDeDemande = this.typeDeDemandes.find(type => type._id === ticket.typeDeDemandeId)?._id || '';
          this.urgence = ticket.urgence;
          this.description = ticket.description;
        } else {
          this.resetFields();
        }
      },
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("L'utilisateur n'est pas connecté");
      return;
    }

    axios.get('http://localhost:5000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        this.products = response.data || [];
        console.log("Types de demandes chargés :", this.products);
      })
      .catch(error => console.error("Erreur lors du chargement des produits :", error));

    axios.get('http://localhost:5000/api/types')
      .then(response => {
        this.typeDeDemandes = response.data || [];
        console.log("Types de demandes chargés :", this.typeDeDemandes);
      })
      .catch(error => console.error("Erreur lors du chargement des types de demandes :", error));
  },
  methods: {
    resetFields() {
      this.selectedProduct = '';
      this.selectedTypeDeDemande = '';
      this.urgence = '';
      this.description = '';
      this.file = null;
    },
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

      // Extract user ID from token
      let userId;
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userId = decodedToken.id;
      } catch (error) {
        console.error("Erreur lors de la récupération de userId à partir du token :", error);
        alert("Erreur lors de la récupération de userId");
        return;
      }

      const apiEndpoint = this.isEdit ? `http://localhost:5000/api/tickets/${this.ticket._id}` : 'http://localhost:5000/api/tickets';
      const method = this.isEdit ? 'put' : 'post';

      // Use FormData if there’s a file
      const data = this.file ? new FormData() : { 
        productId: this.selectedProduct,
        typeDeDemandeId: this.selectedTypeDeDemande,
        urgence: this.urgence,
        description: this.description,
        status: this.status,
        userId: userId
      };
      
      if (this.file) {
        data.append('file', this.file);
        data.append('productId', this.selectedProduct);
        data.append('typeDeDemandeId', this.selectedTypeDeDemande);
        data.append('urgence', this.urgence);
        data.append('description', this.description);
        data.append('status', this.status);
        data.append('userId', userId);
      }

      axios({
        method,
        url: apiEndpoint,
        data,
        headers: {
          'Content-Type': this.file ? 'multipart/form-data' : 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          console.log("Ticket traité avec succès :", response.data);
          this.$emit('close');
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi des données :", error.response?.data || error.message);
          alert(`Erreur : ${error.response?.data?.message || 'Erreur inconnue'}`);
        });
    },

    handleFileChange(event) {
      this.file = event.target.files[0];
    },
  },
};
</script>
