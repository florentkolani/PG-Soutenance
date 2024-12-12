<template>
  <div class="p-4">
    <!-- Header intégré -->
    <Header 
      title="NOVA LEAD" 
      primaryActionText="New Product" 
      @primaryAction="showProductModal = true" 
      @filterAction="openFilterOptions" 
      @goToDashboard="redirectToDashboard" 
    />

    <h1 class="text-xl font-bold mb-4">Gestion des Documents PDF</h1>

    <!-- Formulaire de téléchargement -->
    <form @submit.prevent="uploadPdf" class="mb-6">
  <label for="pdfFile" class="block text-sm font-medium text-gray-700 mb-2">Ajouter un PDF :</label>
  <input
    type="file"
    id="pdfFile"
    ref="fileInput"
    accept="application/pdf"
    @change="onFileChange"
    class="block w-full border border-gray-300 rounded p-2 mb-4"
  />
  <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Commentaire :</label>
  <textarea
    id="comment"
    v-model="comment"
    class="block w-full border border-gray-300 rounded p-2 mb-4"
    placeholder="Ajoutez un commentaire au fichier PDF"
  ></textarea>
  <button
    type="submit"
    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
    :disabled="!pdfFile || !comment"
  >
    Publier
  </button>
</form>


    <!-- Liste des PDF publiés -->
    <h2 class="text-lg font-semibold mb-2">Documents PDF :</h2>
    <ul v-if="pdfList.length > 0" class="list-disc pl-5">
      <li v-for="(pdf, index) in pdfList" :key="index" class="mb-2 flex flex-col">
        <span><strong>Nom :</strong> {{ pdf.name }}</span>
        <span><strong>Commentaire :</strong> {{ pdf.comment }}</span>
        <a
          :href="pdf.url"
          download
          class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
        >
          Télécharger
        </a>
      </li>
    </ul>
    <p v-else class="text-gray-500">Aucun document publié pour l'instant.</p>
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue";
import axios from "axios";

export default {
  components: { Header },
  data() {
    return {
      pdfFile: null,
      comment: "", // Nouveau champ pour le commentaire
      pdfList: [],
    };
  },
  methods: {
    onFileChange(event) {
      this.pdfFile = event.target.files[0];
    },
    async uploadPdf() {
      if (!this.pdfFile || !this.comment) return;

      const formData = new FormData();
      formData.append("pdf", this.pdfFile);
      formData.append("comment", this.comment);

      try {
        const response = await axios.post("http://localhost:5000/api/pdfs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.pdfList.push(response.data);

        // Réinitialiser les champs
        this.pdfFile = null;
        this.comment = "";
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = "";
        }
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
      }
    },
    async fetchPdfList() {
      try {
        const response = await axios.get("http://localhost:5000/api/pdfs");
        this.pdfList = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des PDF :", error);
      }
    },
  },
  async created() {
    await this.fetchPdfList(); // Charger les PDF existants depuis la base de données
  },

    // Actions du Header
    openFilterOptions() {
      alert("Options de filtrage ouvertes !");
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
};
</script>

<style scoped>
button[type="button"] {
  padding: 0;
  background: none;
}
</style>
