<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-2 px-4 pb-4 text-center">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-gray-100 px-3 py-2 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Modifier la vidéo' : 'Ajouter une vidéo' }}
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="closeModal"
          >
            <span class="sr-only">Fermer</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="bg-white px-4 pt-3 pb-3 sm:p-4">
          <form @submit.prevent="isEditing ? updateVideo() : uploadVideo()">
            <div class="grid grid-cols-1 gap-2">
              <div class="mb-2">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                  Titre <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  v-model="title"
                  class="block w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Titre de la vidéo"
                />
              </div>

              <!-- Type de Demande Select -->
              <div class="mb-2">
                <label for="typeDeDemande" class="block text-sm font-medium text-gray-700 mb-1">
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
              <div class="mb-2">
                <label for="product" class="block text-sm font-medium text-gray-700 mb-1">
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
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ajouter une vidéo
                </label>
                <div
                  class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer transition-colors duration-200"
                  @click="$refs.fileInput.click()"
                >
                  <input
                    type="file"
                    id="videoFile"
                    ref="fileInput"
                    accept=".mp4,.avi,.mov,.wmv,.flv,.mkv"
                    @change="onFileChange"
                    class="hidden"
                  />
                  <template v-if="!videoFile">
                    <div class="space-y-1 text-center">
                      <svg
                        class="mx-auto h-8 w-8 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <div class="text-sm text-gray-600">
                        <span class="font-medium text-blue-500 hover:text-blue-600">
                          Cliquer pour choisir
                        </span>
                        <p class="text-xs text-gray-500 mt-1">
                          MP4, AVI, MOV, WMV, FLV, MKV
                        </p>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                      <p class="text-sm text-gray-700 truncate">{{ videoFile.name }}</p>
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

              <!-- Zone de commentaire -->
              <div class="mb-2">
                <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">Ajouter Commentaire :</label>
                <textarea
                  id="comment"
                  v-model="comment"
                  class="block w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Ajoutez un commentaire à la vidéo"
                ></textarea>
              </div>

              <div class="mt-3 sm:mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  @click="closeModal"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                  :disabled="!isFormValid"
                >
                  {{ isEditing ? 'Mettre à jour' : 'Publier' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <DialogModal
      :show="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from '@/services/config';
import DialogModal from './DialogModal.vue';

export default {
  name: 'VideoModal',
  components: {
    DialogModal
  },
  props: {
    modelValue: Boolean,
    editingVideo: {
      type: Object,
      default: null
    },
    products: {
      type: Array,
      required: true
    },
    typeDeDemandes: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue', 'video-updated', 'video-created', 'reset-editing'],
  data() {
    return {
      title: '',
      selectedProduct: '',
      selectedTypeDeDemande: '',
      videoFile: null,
      comment: '',
      isEditing: false,
      showDialog: false,
      dialogType: 'success',
      dialogTitle: '',
      dialogMessage: ''
    }
  },
  computed: {
    isFormValid() {
      if (this.isEditing) {
        return this.title && this.selectedProduct && this.selectedTypeDeDemande && this.comment;
      } else {
        return this.title && this.selectedProduct && this.selectedTypeDeDemande && 
               this.comment && this.videoFile;
      }
    }
  },
  watch: {
    modelValue(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    },
    editingVideo: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isEditing = true;
          this.title = newVal.title || '';
          this.comment = newVal.comment || '';
          if (newVal.TypeDeDemande) {
            this.selectedTypeDeDemande = typeof newVal.TypeDeDemande === 'object' ? 
              newVal.TypeDeDemande._id : newVal.TypeDeDemande;
          } else if (newVal.typededemande) {
            this.selectedTypeDeDemande = typeof newVal.typededemande === 'object' ? 
              newVal.typededemande._id : newVal.typededemande;
          }
          this.selectedProduct = newVal.produit?._id || newVal.produit || '';
        } else {
          this.isEditing = false;
          this.resetForm();
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:modelValue', false);
      this.resetForm();
      this.$emit('reset-editing');
    },
    onFileChange(event) {
      this.videoFile = event.target.files[0];
    },
    removeFile() {
      this.videoFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    resetForm() {
      this.title = '';
      this.comment = '';
      this.selectedTypeDeDemande = '';
      this.selectedProduct = '';
      this.videoFile = null;
      this.isEditing = false;
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
    async uploadVideo() {
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
        this.$emit('video-created', response.data);
        this.showSuccessDialog("La vidéo a été ajoutée avec succès !");
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
        this.showErrorDialog("Une erreur est survenue lors de l'ajout de la vidéo.");
      }
    },
    async updateVideo() {
      const formData = new FormData();
      
      formData.append("title", this.title);
      formData.append("comment", this.comment);
      formData.append("typededemande", this.selectedTypeDeDemande);
      formData.append("produit", this.selectedProduct);

      if (this.videoFile) {
        formData.append("video", this.videoFile);
      }

      try {
        const response = await axios.put(`${API_URL}/videos/uploads/${this.editingVideo._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$emit('video-updated', response.data);
        this.showSuccessDialog("La vidéo a été mise à jour avec succès !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        this.showErrorDialog("Une erreur est survenue lors de la mise à jour de la vidéo.");
      }
    }
  }
}
</script>
