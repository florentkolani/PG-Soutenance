<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header intégré -->
    <Header 
      title="NOVA LEAD" 
      primaryActionText="" 
      @primaryAction="showProductModal = true" 
      @filterAction="openFilterOptions" 
      @goToDashboard="redirectToDashboard" 
      class="fixed top-0 left-0 w-full bg-green shadow z-10"
    />

    <!-- Barre de navigation -->
    <nav class="mt-20 mb-6">
      <ul class="flex space-x-4">
        <li>
          <router-link to="/Pdfuploader" class="text-blue-500 hover:underline" replace>Documents</router-link>
        </li>
        <li>
          <router-link to="/videos" class="text-blue-500 hover:underline">Vidéos</router-link>
        </li>
      </ul>
    </nav>

    <div class="mt-6">
      <h1 class="text-2xl font-bold mb-6">Gestion des Vidéos</h1>

      <!-- Formulaire de téléchargement : Afficher uniquement pour Admin et Agent -->
      <form 
        v-if="isAdmin || isAgentSupport" 
        @submit.prevent="uploadVideo()" 
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
              placeholder="Titre de la vidéo"
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
          <!-- Input pour le fichier vidéo -->
          <div class="mb-4">
            <label for="videoFile" class="block text-sm font-medium text-gray-700 mb-2">Ajouter une Vidéo</label>
            <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer"
              @click="$refs.fileInput.click()"
            >
              <input
                type="file"
                id="videoFile"
                ref="fileInput"
                accept="video/*"
                @change="onFileChange"
                class="hidden"
              />
              <template v-if="!videoFile">
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
                  <p class="text-sm text-gray-700 truncate">{{ videoFile.name }}</p>
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
              placeholder="Ajoutez un commentaire à la vidéo"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          :disabled="!comment || !title || !videoFile || !selectedTypeDeDemande || !selectedProduct"
        >
          Publier
        </button>
      </form>

      <!-- Liste des vidéos publiées -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Vidéos :</h2>
        <div v-if="videoList.length > 0" class="grid grid-cols-1 gap-6">
          <div v-for="(video, index) in videoList" :key="index" class="bg-white shadow rounded-lg p-4 flex">
            <div class="w-1/3">
              <video controls class="w-full h-48">
                <source :src="`http://localhost:5000/api${video.url}`" type="video/mp4">
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
            <div class="w-2/3 pl-10">
              <p class="font-semibold text-gray-800 truncate">{{ video.title }}</p>
              <p class="text-gray-600 text-sm mt-2">
                <span v-if="!video.expanded && video.comment.length > 100">
                  {{ video.comment.substring(0, 100) }}...
                  <button @click="toggleComment(index)" class="text-blue-500 hover:underline">Lire plus</button>
                </span>
                <span v-else>
                  {{ video.comment }}
                  <button v-if="video.comment.length > 100" @click="toggleComment(index)" class="text-blue-500 hover:underline">Réduire</button>
                </span>
              </p>
              <div class="flex justify-between items-center mt-4">
               
                <div>
                  <button
                    v-if="isAdmin || isAgentSupport"
                    @click="editVideo(video)"
                    class="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Date de publication: {{ new Date(video.createdAt).toLocaleString() }}</p>
                  <!-- <p class="text-gray-500 text-sm">Mis à jour le: {{ new Date(video.updatedAt).toLocaleString() }}</p> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">Aucune vidéo publiée pour l'instant.</p>
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
      videoFile: null,
      comment: "",
      title: "",
      videoList: [],
      userRole: "",
      isEditing: false,
      editingVideoId: null,
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
      this.videoFile = event.target.files[0];
    },
    removeFile() {
      this.videoFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    async uploadVideo() {
      if (!this.videoFile || !this.comment || !this.title || !this.selectedTypeDeDemande || !this.selectedProduct) return;

      const formData = new FormData();
      formData.append("video", this.videoFile);
      formData.append("comment", this.comment);
      formData.append("title", this.title);
      formData.append("typededemande", this.selectedTypeDeDemande);
      formData.append("produit", this.selectedProduct);

      try {
        const response = await axios.post(`${API_URL}/videos/uploads`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.videoList.push({ ...response.data, expanded: false });
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
      }
    },
    async fetchVideoList() {
      try {
        const response = await axios.get(`${API_URL}/videos/uploads`);
        this.videoList = response.data.map((video) => ({ ...video, expanded: false }));
      } catch (error) {
        console.error("Erreur lors de la récupération des vidéos :", error);
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
      this.videoList[index].expanded = !this.videoList[index].expanded;
    },
    openFilterOptions() {
      alert("Options de filtrage ouvertes !");
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
    editVideo(video) {
      this.isEditing = true;
      this.editingVideoId = video._id;
      this.title = video.title;
      this.comment = video.comment;
      this.selectedTypeDeDemande = video.typededemande._id;
      this.selectedProduct = video.produit._id;
      this.videoFile = null;
    },
    resetForm() {
      this.isEditing = false;
      this.editingVideoId = null;
      this.title = "";
      this.comment = "";
      this.selectedTypeDeDemande = "";
      this.selectedProduct = "";
      this.videoFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
  },
  async created() {
    this.decodeToken();
    await this.fetchVideoList();
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
