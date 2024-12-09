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
        accept="application/pdf"
        @change="onFileChange"
        class="block w-full border border-gray-300 rounded p-2 mb-4"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        :disabled="!pdfFile"
      >
        Publier
      </button>
    </form>

    <!-- Liste des PDF publiés -->
    <h2 class="text-lg font-semibold mb-2">Documents PDF :</h2>
    <ul v-if="pdfList.length > 0" class="list-disc pl-5">
      <li v-for="(pdf, index) in pdfList" :key="index" class="mb-2 flex items-center">
        <span class="mr-4">{{ pdf.name }}</span>
        <a
          :href="pdf.url"
          download
          class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Télécharger
        </a>
      </li>
    </ul>
    <p v-else class="text-gray-500">Aucun document publié pour l'instant.</p>
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue"; // Assurez-vous que le chemin est correct

export default {
  components: { Header },
  data() {
    return {
      pdfFile: null, // Fichier PDF sélectionné
      pdfList: [], // Liste des PDF publiés
      showProductModal: false, // Contrôle pour afficher le modal "New Product"
    };
  },
  methods: {
    // Gestion de la sélection de fichier
    onFileChange(event) {
      this.pdfFile = event.target.files[0];
    },
    // Téléchargement d'un PDF
    uploadPdf() {
      if (!this.pdfFile) return;

      // Création d'un objet URL pour le fichier PDF
      const pdfUrl = URL.createObjectURL(this.pdfFile);
      this.pdfList.push({ name: this.pdfFile.name, url: pdfUrl });

      // Réinitialiser le fichier sélectionné
      this.pdfFile = null;
      this.$refs.fileInput.value = ""; // Réinitialiser le champ de fichier
    },
    // Actions du Header
    openFilterOptions() {
      alert("Options de filtrage ouvertes !");
    },
    redirectToDashboard() {
      this.$router.push("/dashboard"); // Redirige vers la page Dashboard
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles spécifiques si nécessaire */
</style>
