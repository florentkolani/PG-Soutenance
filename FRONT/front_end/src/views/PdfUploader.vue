<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header intégré -->
    <Header 
      title="NOVA LEAD" 
      primaryActionText="" 
      @primaryAction="showProductModal = true" 
      @goToDashboard="redirectToDashboard" 
      class="fixed top-0 left-0 w-full bg-green shadow z-10"
    />
    <div class="container mx-auto px-4 mt-12">
  <div class="flex justify-between items-center">
    <!-- Barre de navigation (liens à gauche) -->
    <nav class="bg-white shadow rounded-lg p-3">
      <ul class="flex space-x-4">
        <li>
          <router-link to="/Pdfuploader" class="text-blue-500 hover:underline" replace>Documents</router-link>
        </li>
        <li>
          <router-link to="/videos" class="text-blue-500 hover:underline">Vidéos</router-link>
        </li>
      </ul>
    </nav>

    <!-- Filtre par produit (à droite) -->
    <div class="w-1/6">
      <select
        v-model="filterProduct"
        id="filterProduct"
        class="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="filterPdfs"
      >
        <option value="">Tous les produits</option>
        <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
      </select>
    </div>
  </div>
</div>
    <div class="mt-4">
      <h1 class="text-2xl font-bold mb-6">MANUELS ET GUIDES</h1>
      <!-- Formulaire de téléchargement : Afficher uniquement pour Admin et Agent -->
      <form 
        v-if="isAdmin || isAgentSupport" 
        @submit.prevent="isEditing ? updatePdf() : uploadPdf()" 
        class="bg-white shadow rounded-lg p-6 mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Input pour le titre -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Titre <span class="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              v-model="title"
              class="block w-full border border-gray-300 rounded-lg p-2"
              placeholder="Titre du document"
            />
          </div>
          <!-- Type de Demande Select -->
          <div class="mb-4">
            <label for="typeDeDemande" class="block text-sm font-medium text-gray-700 mb-2">
              Type de Demande <span class="text-red-500">*</span>
            </label>
            <select
              v-model="selectedTypeDeDemande"
              id="typeDeDemande"
              required
              class="block w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Sélectionner un type de demande</option>
              <option v-for="type in typeDeDemandes" :key="type._id" :value="type._id">{{ type.name }}</option>
            </select>
          </div>
          <!-- Product Select -->
          <div class="mb-4">
            <label for="product" class="block text-sm font-medium text-gray-700 mb-2">
              Produit <span class="text-red-500">*</span>
            </label>
            <select
              v-model="selectedProduct"
              id="product"
              required
              class="block w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Sélectionner un produit</option>
              <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
            </select>
          </div>
          <!-- Input pour le fichier -->
          <div class="mb-4">
            <label for="pdfFile" class="block text-sm font-medium text-gray-700 mb-2">Ajouter un Document</label>
            <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer"
              @click="$refs.fileInput.click()"
            >
              <input
                type="file"
                id="pdfFile"
                ref="fileInput"
                accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                @change="onFileChange"
                class="hidden"
              />
              <template v-if="!pdfFile">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Cliquer pour choisir un fichier</p>
              </template>
              <template v-else>
                <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <p class="text-sm text-gray-700 truncate">{{ pdfFile.name }}</p>
                  <button 
                    type="button" 
                    @click="removeFile" 
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    ✖
                  </button>
                </div>
              </template>
            </div>
          </div>
          <!-- Zone de commentaire -->
          <div class="col-span-2 mb-4">
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Ajouter Commentaire :</label>
            <textarea
              id="comment"
              v-model="comment"
              class="block w-full border border-gray-300 rounded-lg p-2"
              placeholder="Ajoutez un commentaire au fichier PDF"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          :disabled="!comment || !title || !selectedTypeDeDemande || !selectedProduct"
        >
          {{ isEditing ? 'Mettre à jour' : 'Publier' }}
        </button>
      </form>

      <!-- Liste des PDF publiés -->
      <div>
        <!-- <h2 class="text-lg font-semibold mb-4">MANUELS ET GUIDES :</h2> -->
        <div v-if="filteredPdfList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(pdf, index) in filteredPdfList" :key="index" class="bg-white shadow rounded-lg p-4">
            <p class="font-semibold text-gray-800 truncate">{{ pdf.title }}</p>
            <p class="text-gray-600 text-sm mt-2">
              <span v-if="!pdf.expanded && pdf.comment.length > 100">
                {{ pdf.comment.substring(0, 100) }}...
                <button @click="toggleComment(index)" class="text-blue-500 hover:underline">Lire plus</button>
              </span>
              <span v-else>
                {{ pdf.comment }}
                <button v-if="pdf.comment.length > 100" @click="toggleComment(index)" class="text-blue-500 hover:underline">Réduire</button>
              </span>
            </p>
            <div class="flex justify-between items-center mt-4">
              <div>
                <p class="text-gray-500 text-sm">Créé le: {{ new Date(pdf.createdAt).toLocaleString() }}</p>
                <p class="text-gray-500 text-sm">Mis à jour le: {{ new Date(pdf.updatedAt).toLocaleString() }}</p>
              </div>
              <div>
                <a
                  :href="`http://localhost:5000/api/pdfs/download/${pdf.url.split('/').pop()}`"
                  download
                  class="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-2"
                >
                  Télécharger
                </a>
                <button
                  v-if="isAdmin || isAgentSupport"
                  @click="editPdf(pdf)"
                  class="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">Aucun document publié pour l'instant.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue";
import axios from "axios";
import { API_URL } from '@/services/config';

export default {
  components: { Header },
  data() {
    return {
      products: [],
      typeDeDemandes: [],
      selectedProduct: '',
      selectedTypeDeDemande: '',
      pdfFile: null,
      comment: "",
      title: "",
      pdfList: [],
      userRole: "",
      isEditing: false,
      editingPdfId: null,
      filterProduct: '',
      filteredPdfList: [],
    };
  },
  computed: {
    isAdmin() {
      return this.userRole === "Admin";
    },
    isAgentSupport() {
      return this.userRole === "AgentSupport";
    },
    isClient() {
      return this.userRole === "Client";
    },
  },
  methods: {
    decodeToken() {
      const token = localStorage.getItem("token"); 
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          this.userRole = payload.role;
        } catch (error) {
          console.error("Erreur lors du décodage du token :", error);
        }
      }
    },
    onFileChange(event) {
      this.pdfFile = event.target.files[0];
    },
    removeFile() {
      this.pdfFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    async uploadPdf() {
      if (!this.pdfFile || !this.comment || !this.title || !this.selectedTypeDeDemande || !this.selectedProduct) return;

      const formData = new FormData();
      formData.append("pdf", this.pdfFile);
      formData.append("comment", this.comment);
      formData.append("title", this.title);
      formData.append("typededemande", this.selectedTypeDeDemande);
      formData.append("produit", this.selectedProduct);

      try {
        const response = await axios.post(`${API_URL}/pdfs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.pdfList.push({ ...response.data, expanded: false });
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
      }
    },
    async updatePdf() {
  if (!this.comment || !this.title || !this.selectedTypeDeDemande || !this.selectedProduct) return;

  const formData = new FormData();
  if (this.pdfFile) {
    formData.append("pdf", this.pdfFile);
  }
  formData.append("comment", this.comment);
  formData.append("title", this.title);
  formData.append("typededemande", this.selectedTypeDeDemande);
  formData.append("produit", this.selectedProduct);

  try {
    const response = await axios.put(`${API_URL}/pdfs/${this.editingPdfId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Trouver l'index du PDF mis à jour
    const index = this.pdfList.findIndex(pdf => pdf._id === this.editingPdfId);
    if (index !== -1) {
      // Mettre à jour directement l'élément dans la liste
      this.pdfList[index] = { ...response.data, expanded: false };
    }
    this.resetForm();
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
}
,
    async fetchPdfList() {
      try {
        const response = await axios.get(`${API_URL}/pdfs`);
        this.pdfList = response.data.map((pdf) => ({ ...pdf, expanded: false }));
        this.filterPdfs();
      } catch (error) {
        console.error("Erreur lors de la récupération des PDF :", error);
      }
    },
    async fetchProduits() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!Array.isArray(response.data)) {
          console.error("Données produits invalides :", response.data);
          this.products = [];
        } else {
          this.products = response.data;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    },
    async fetchTypesDeDemande() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/types`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.typeDeDemandes = response.data.types || [];
      } catch (error) {
        console.error("Erreur lors du chargement des types de demandes :", error);
      }
    },
    toggleComment(index) {
      this.pdfList[index].expanded = !this.pdfList[index].expanded;
    },
    openFilterOptions() {
      alert("Options de filtrage ouvertes !");
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
    editPdf(pdf) {
      this.isEditing = true;
      this.editingPdfId = pdf._id;
      this.title = pdf.title;
      this.comment = pdf.comment;
      this.selectedTypeDeDemande = pdf.typededemande._id;
      this.selectedProduct = pdf.produit._id;
      this.pdfFile = null;
    },
    resetForm() {
      this.isEditing = false;
      this.editingPdfId = null;
      this.title = "";
      this.comment = "";
      this.selectedTypeDeDemande = "";
      this.selectedProduct = "";
      this.pdfFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    filterPdfs() {
      if (this.filterProduct) {
        this.filteredPdfList = this.pdfList.filter(pdf => pdf.produit._id === this.filterProduct);
      } else {
        this.filteredPdfList = this.pdfList;
      }
    },
  },
  async created() {
    this.decodeToken();
    await this.fetchPdfList();
    await this.fetchTypesDeDemande();
    await this.fetchProduits();
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}
button[type="button"] {
  padding: 0;
  background: none;
}
</style>
