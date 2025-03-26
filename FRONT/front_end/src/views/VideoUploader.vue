<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header intégré -->
    <Header 
      title="NOVA LEAD" 
      :primaryActionText="isAdmin || isAgentSupport ? 'Ajouter une vidéo' : ''" 
      @primaryAction="showVideoModal = true" 
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
            @change="filtervideos"
          >
            <option value="">Tous les produits</option>
            <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <h1 class="text-2xl font-bold mb-6">TUTORIELS</h1>

      <!-- Liste des vidéos publiées -->
      <div>
        <div v-if="filteredVideoList.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(video, index) in filteredVideoList" :key="index" class="bg-white shadow rounded-lg p-4 flex">
            <div class="w-1/2">
              <video controls class="w-full h-48">
                <source :src="`http://localhost:5000/api${video.url}`" type="video/mp4">
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              <div>
                  <p class="text-gray-500 text-sm">Date de publication: {{ new Date(video.createdAt).toLocaleString() }}</p>
                  <!-- <p class="text-gray-500 text-sm">Mis à jour le: {{ new Date(video.updatedAt).toLocaleString() }}</p> -->
                </div>
            </div>
            <div class="w-1/2 pl-10">
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
                
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">Aucune vidéo publiée pour l'instant.</p>
      </div>
    </div>

    <!-- Modal -->
    <VideoModal
      v-model="showVideoModal"
      :editing-video="editingVideo"
      :products="products"
      :typeDeDemandes="typeDeDemandes"
      @video-created="onVideoCreated"
      @video-updated="onVideoUpdated"
    />
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue";
import VideoModal from "@/components/layouts/VideoModal.vue";
import axios from "axios";
import { API_URL } from '@/services/config';

export default {
  components: { 
    Header,
    VideoModal
  },
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
      filterProduct: '',
      filteredVideoList: [],
      showVideoModal: false,
      editingVideo: null,
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
        this.filtervideos();
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
      this.editingVideo = video;
      this.showVideoModal = true;
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
    filtervideos() {
      if (this.filterProduct) {
        this.filteredVideoList = this.videoList.filter(video => {
          const productId = video.produit?._id || video.produit;
          return productId === this.filterProduct;
        });
      } else {
        this.filteredVideoList = this.videoList;
      }
    },
    onVideoCreated(newVideo) {
      this.videoList.push({ ...newVideo, expanded: false });
      this.filtervideos();
    },
    onVideoUpdated(updatedVideo) {
      const index = this.videoList.findIndex(video => video._id === updatedVideo._id);
      if (index !== -1) {
        this.videoList[index] = { ...updatedVideo, expanded: false };
        this.filtervideos();
      }
    }
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
