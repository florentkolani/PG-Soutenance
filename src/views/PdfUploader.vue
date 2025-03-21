<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <Header 
      title="NOVA LEAD" 
      :isAdmin="isAdmin"
      :isAgentSupport="isAgentSupport"
      @showUploadModal="showPdfModal = true"
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

      <!-- Liste des PDF publiés -->
      <div>
        <div v-if="filteredPdfList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- ... reste du code pour l'affichage des PDFs ... -->
        </div>
        <p v-else class="text-gray-500">Aucun document publié pour l'instant.</p>
      </div>
    </div>

    <!-- Modal pour l'ajout/modification de PDF -->
    <PdfUploadModal
      v-model="showPdfModal"
      :editing-pdf="editingPdf"
      @pdf-uploaded="onPdfUploaded"
      @pdf-updated="onPdfUpdated"
    />
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue";
import PdfUploadModal from "@/components/layouts/PdfUploadModal.vue";
import axios from "axios";
import { API_URL } from '@/services/config';

export default {
  components: { 
    Header,
    PdfUploadModal
  },
  data() {
    return {
      showPdfModal: false,
      editingPdf: null,
      products: [],
      pdfList: [],
      userRole: "",
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
    }
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
        this.products = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    },
    editPdf(pdf) {
      this.editingPdf = pdf;
      this.showPdfModal = true;
    },
    onPdfUploaded(newPdf) {
      this.pdfList.push({ ...newPdf, expanded: false });
      this.filterPdfs();
    },
    onPdfUpdated(updatedPdf) {
      const index = this.pdfList.findIndex(pdf => pdf._id === updatedPdf._id);
      if (index !== -1) {
        this.pdfList[index] = { ...updatedPdf, expanded: false };
        this.filterPdfs();
      }
    },
    filterPdfs() {
      if (this.filterProduct) {
        this.filteredPdfList = this.pdfList.filter(pdf => pdf.produit._id === this.filterProduct);
      } else {
        this.filteredPdfList = this.pdfList;
      }
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    }
  },
  async created() {
    this.decodeToken();
    await this.fetchPdfList();
    await this.fetchProduits();
  }
};
</script> 