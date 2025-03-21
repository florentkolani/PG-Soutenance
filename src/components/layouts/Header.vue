<template>
  <header class="bg-white shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-gray-800">{{ title }}</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          v-if="isAdmin || isAgentSupport"
          @click="showUploadModal"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Ajouter {{ currentRoute === '/videos' ? 'une vidéo' : 'un document' }}
        </button>
        <button
          @click="$emit('goToDashboard')"
          class="text-gray-600 hover:text-gray-800"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isAgentSupport: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    showUploadModal() {
      this.$emit('showUploadModal');
    }
  }
}
</script> 