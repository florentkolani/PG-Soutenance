<template>
  <div v-if="modelValue" class="modal">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-2 px-4 pb-4 text-center">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-gray-100 px-3 py-2 flex justify-between items-center">
            <h3 class="text-2xl font-bold text-black pl-4">
              {{ modalTitle }}
            </h3>
            <button type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none" @click="closeModal">
              <span class="sr-only">Fermer</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="bg-white px-4 pt-3 pb-3 sm:p-4">
            <form @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-2">
                <div class="mb-2">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                    Titre <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="title" v-model="form.title"
                    class="block w-full border border-gray-300 rounded-lg p-2" placeholder="Titre du document" />
                </div>

                <div class="mb-4">
                  <label for="typeDeDemande" class="block text-sm font-medium text-gray-700 mb-2">
                    Type de Demande <span class="text-red-500">*</span>
                  </label>
                  <select v-model="form.typededemande" id="typeDeDemande" required
                    class="block w-full border border-gray-300 rounded-lg p-2">
                    <option value="">Sélectionner un type de demande</option>
                    <option v-for="type in typeDeDemandes" :key="type._id" :value="type._id">{{ type.name }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label for="product" class="block text-sm font-medium text-gray-700 mb-2">
                    Produit <span class="text-red-500">*</span>
                  </label>
                  <select v-model="form.produit" id="product" required
                    class="block w-full border border-gray-300 rounded-lg p-2">
                    <option value="">Sélectionner un produit</option>
                    <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}
                    </option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ajouter un document
                  </label>
                  <div
                    class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors duration-200"
                    @click="$refs.fileInput.click()">
                    <input type="file" id="pdfFile" ref="fileInput"
                      accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      @change="onFileChange" class="hidden" />
                    <template v-if="!form.pdfFile">
                      <div class="space-y-1 text-center">
                        <svg class="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div class="text-sm text-gray-600">
                          <span class="font-medium text-blue-500 hover:text-blue-600">
                            Cliquer pour choisir
                          </span>
                          <p class="text-xs text-gray-500 mt-1">
                            PDF, Word, PowerPoint
                          </p>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                        <p class="text-sm text-gray-700 truncate">{{ form.pdfFile.name }}</p>
                        <button type="button" @click.stop="removeFile"
                          class="text-red-500 hover:text-red-700 focus:outline-none">
                          ✖
                        </button>
                      </div>
                    </template>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Ajouter Commentaire
                    :</label>
                  <textarea id="comment" v-model="form.comment"
                    class="block w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Ajoutez un commentaire au fichier PDF"></textarea>
                </div>

                <div class="mt-3 sm:mt-4 flex justify-end space-x-2">
                  <button type="submit"
                    class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
                    :disabled="!isFormValid">
                    {{ editingPdf ? 'Mettre à jour' : 'Publier' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <DialogModal :show="showDialog" :type="dialogType" :title="dialogTitle" :message="dialogMessage"
      @close="closeDialog" />
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from '@/services/config';
import DialogModal from './DialogModal.vue';

export default {
  name: 'PdfModal',
  components: {
    DialogModal
  },
  props: {
    modelValue: Boolean,
    editingPdf: Object,
    products: Array,
    typeDeDemandes: Array
  },
  emits: ['update:modelValue', 'pdf-updated', 'pdf-created'],
  data() {
    return {
      form: {
        title: '',
        comment: '',
        typededemande: '',
        produit: '',
        pdfFile: null
      },
      showDialog: false,
      dialogType: 'success',
      dialogTitle: '',
      dialogMessage: ''
    }
  },
  computed: {
    modalTitle() {
      return this.editingPdf ? 'Modifier le document' : 'Ajouter un document';
    },
    isFormValid() {
      return this.form.title && this.form.produit && this.form.typededemande &&
        this.form.comment && (this.editingPdf || this.form.pdfFile);
    }
  },
  watch: {
    editingPdf(newVal) {
      if (newVal) {
        this.form = {
          title: newVal.title,
          comment: newVal.comment,
          typededemande: newVal.typededemande?._id || newVal.typededemande,
          produit: newVal.produit?._id || newVal.produit,
          pdfFile: null
        };
      }
    },
    modelValue(newVal) {
      if (!newVal) {
        this.resetForm();
      } else if (!this.editingPdf) {
        this.resetForm();
      }
    }
  },
  methods: {
    resetForm() {
      this.form = {
        title: '',
        comment: '',
        typededemande: '',
        produit: '',
        pdfFile: null
      };
    },
    closeModal() {
      this.$emit('update:modelValue', false);
      setTimeout(() => {
        this.resetForm();
      }, 300);
    },
    onFileChange(event) {
      this.form.pdfFile = event.target.files[0];
    },
    removeFile() {
      this.form.pdfFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    showSuccessDialog(message) {
      this.dialogType = 'success';
      this.dialogTitle = 'Succès';
      this.dialogMessage = message;
      this.showDialog = true;
    },
    showErrorDialog(message) {
      this.dialogType = 'error';
      this.dialogTitle = 'Erreur';
      this.dialogMessage = message;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
      if (this.dialogType === 'success') {
        this.closeModal();
      }
    },
    async handleSubmit() {
      const formData = new FormData();
      if (this.form.pdfFile) {
        formData.append("pdf", this.form.pdfFile);
      }
      formData.append("comment", this.form.comment);
      formData.append("title", this.form.title);
      formData.append("typededemande", this.form.typededemande);
      formData.append("produit", this.form.produit);

      try {
        if (!this.editingPdf) {
          const response = await axios.post(`${API_URL}/pdfs`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.$emit('pdf-created', response.data);
          this.showSuccessDialog("Le document a été ajouté avec succès !");
        } else {
          const response = await axios.put(`${API_URL}/pdfs/${this.editingPdf._id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.$emit('pdf-updated', response.data);
          this.showSuccessDialog("Le document a été mis à jour avec succès !");
        }
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
        this.showErrorDialog("Une erreur est survenue lors de l'ajout ou de la mise à jour du document.");
      }
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>
