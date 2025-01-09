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

    <div class="mt-20">
      <h1 class="text-2xl font-bold mb-6">Gestion des Documents PDF</h1>

      <!-- Formulaire de téléchargement : Afficher uniquement pour Admin et Agent -->
      <form 
        v-if="isAdmin || isAgentSupport" 
        @submit.prevent="uploadPdf" 
        class="bg-white shadow rounded-lg p-6 mb-8"
      >
        <div class="flex gap-4">
          <!-- Input pour le fichier -->
          <div class="w-1/5 mb-4">
            <label for="pdfFile" class="block text-sm font-medium text-gray-700 mb-2">Ajouter un Document</label>
            <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer"
              @click="$refs.fileInput.click()"
            >
              <input
                type="file"
                id="pdfFile"
                ref="fileInput"
                accept="application/pdf"
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
          <div class="w-4/5 mb-4">
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Ajouter Commentaire :</label>
            <textarea
              id="comment"
              v-model="comment"
              class="block w-full border border-gray-300 rounded-lg p-10 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ajoutez un commentaire au fichier PDF"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          :disabled="!pdfFile || !comment"
        >
          Publier
        </button>
      </form>

      <!-- Liste des PDF publiés -->
      <div>
        <h2 class="text-lg font-semibold mb-4">Documents PDF :</h2>
        <div v-if="pdfList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(pdf, index) in pdfList" :key="index" class="bg-white shadow rounded-lg p-4">
            <p class="font-semibold text-gray-800 truncate">{{ pdf.name }}</p>
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
            <a
              :href="`http://localhost:5000/api/pdfs/download/${pdf.url.split('/').pop()}`"
              download
              class="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Télécharger
            </a>
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
      pdfFile: null,
      comment: "",
      pdfList: [],
      userRole: "", 
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
      if (!this.pdfFile || !this.comment) return;

      const formData = new FormData();
      formData.append("pdf", this.pdfFile);
      formData.append("comment", this.comment);

      try {
        const response = await axios.post(`${API_URL}/pdfs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.pdfList.push({ ...response.data, expanded: false });
        this.removeFile();
        this.comment = "";
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
      }
    },
    async fetchPdfList() {
      try {
        const response = await axios.get(`${API_URL}/pdfs`);
        this.pdfList = response.data.map((pdf) => ({ ...pdf, expanded: false }));
      } catch (error) {
        console.error("Erreur lors de la récupération des PDF :", error);
      }
    },
    toggleComment(index) {
      this.pdfList[index].expanded = !this.pdfList[index].expanded;
    },
  },
  async created() {
    this.decodeToken();
    await this.fetchPdfList();
  },
  openFilterOptions() {
    alert("Options de filtrage ouvertes !");
  },
  redirectToDashboard() {
    this.$router.push("/dashboard");
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
