<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="isEditing ? updateVideo() : uploadVideo()" class="p-6">
          <!-- Contenu similaire à PdfUploadModal mais adapté pour les vidéos -->
          <!-- ... -->
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  name: 'VideoUploadModal',
  props: {
    modelValue: Boolean,
    editingVideo: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue', 'video-uploaded', 'video-updated'],
  data() {
    return {
      title: '',
      comment: '',
      videoFile: null,
      selectedTypeDeDemande: '',
      selectedProduct: '',
      isEditing: false,
      products: [],
      typeDeDemandes: []
    }
  },
  methods: {
    // Méthodes similaires à PdfUploadModal mais adaptées pour les vidéos
  },
  watch: {
    editingVideo(newVal) {
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