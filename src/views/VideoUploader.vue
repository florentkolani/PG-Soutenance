<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <Header 
      title="NOVA LEAD" 
      @showUploadModal="showVideoModal = true"
      @goToDashboard="redirectToDashboard" 
      class="fixed top-0 left-0 w-full bg-green shadow z-10"
    />
    
    <!-- ... reste du template sans le formulaire ... -->

    <VideoUploadModal
      v-model="showVideoModal"
      :editing-video="editingVideo"
      @video-uploaded="onVideoUploaded"
      @video-updated="onVideoUpdated"
    />
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue";
import VideoUploadModal from "@/components/layouts/VideoUploadModal.vue";
// ... reste du script similaire à PdfUploader.vue
</script> 