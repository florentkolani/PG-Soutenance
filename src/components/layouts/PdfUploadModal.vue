<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="isEditing ? updatePdf() : uploadPdf()" class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">{{ isEditing ? 'Modifier le document' : 'Ajouter un document' }}</h3>
            <button type="button" @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Fermer</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Titre <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                v-model="title"
                class="block w-full border border-gray-300 rounded-lg p-2"
                placeholder="Titre du document"
              />
            </div>

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
                <option v-for="type in typeDeDemandes" :key="type._id" :value="type._id">
                  {{ type.name }}
                </option>
              </select>
            </div>

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
                <option v-for="product in products" :key="product._id" :value="product._id">
                  {{ product.name }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label for="pdfFile" class="block text-sm font-medium text-gray-700 mb-2">
                Ajouter un Document
              </label>
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
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
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
                      @click.stop="removeFile"
                      class="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      ✖
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <div class="mb-4">
              <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                Commentaire
              </label>
              <textarea
                id="comment"
                v-model="comment"
                rows="4"
                class="block w-full border border-gray-300 rounded-lg p-2"
                placeholder="Ajoutez un commentaire au document"
              ></textarea>
            </div>
          </div>

          <div class="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              :disabled="!comment || !title || !selectedTypeDeDemande || !selectedProduct"
            >
              {{ isEditing ? 'Mettre à jour' : 'Publier' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  name: 'PdfUploadModal',
  props: {
    modelValue: Boolean,
    editingPdf: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue', 'pdf-uploaded', 'pdf-updated'],
  data() {
    return {
      title: '',
      comment: '',
      pdfFile: null,
      selectedTypeDeDemande: '',
      selectedProduct: '',
      isEditing: false,
      products: [],
      typeDeDemandes: []
    }
  },
  methods: {
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
        this.$emit('pdf-uploaded', response.data);
        this.closeModal();
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
        const response = await axios.put(`${API_URL}/pdfs/${this.editingPdf._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$emit('pdf-updated', response.data);
        this.closeModal();
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
      }
    },
    closeModal() {
      this.$emit('update:modelValue', false);
      this.resetForm();
    },
    resetForm() {
      this.title = '';
      this.comment = '';
      this.pdfFile = null;
      this.selectedTypeDeDemande = '';
      this.selectedProduct = '';
      this.isEditing = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    }
  },
  watch: {
    editingPdf(newVal) {
      if (newVal) {
        this.isEditing = true;
        this.title = newVal.title;
        this.comment = newVal.comment;
        this.selectedTypeDeDemande = newVal.typededemande._id;
        this.selectedProduct = newVal.produit._id;
      }
    }
  },
  async created() {
    await this.fetchProduits();
    await this.fetchTypesDeDemande();
  }
}
</script> 