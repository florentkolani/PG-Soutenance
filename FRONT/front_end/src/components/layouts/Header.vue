<template>
  <header class="bg-white border-b shadow-sm">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo avec redirection vers le Dashboard -->
      <div class="flex items-center space-x-3 cursor-pointer" @click="goToDashboard">
        <img :src="logo" alt="Logo" class="h-10 w-10 rounded-lg shadow-sm" />
        <span class="text-xl font-bold text-gray-800">{{ title }}</span>
      </div>

      <div class="flex items-center space-x-4">
        <button 
          v-if="primaryActionText" 
          @click="$emit('primaryAction')" 
          class="flex items-center space-x-2 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors duration-200 shadow-sm"
        > 
          <span>{{ primaryActionText }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>

        <div v-if="filterAction && showFilter" class="relative">
          <select 
            v-model="selectedStatus" 
            @change="emitFilter" 
            class="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import GoToDashboard from "@/components/layouts/GoToDashboard.vue";
import logo from "@/assets/logo.png";

export default {
  name: "Header",
  components: {
    GoToDashboard,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    primaryActionText: {
      type: String,
      default: null,
    },
    filterAction: {
      type: Boolean,
      default: true,
    },
    filterOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedStatus: '', // Valeur du filtre sélectionné
      logo,
    };
  },
  computed: {
    showFilter() {
      const excludedRoutes = ['VideoUploader', 'sendEmail', 'PdfUploader', 'Archives', 'Apropos', 'GestionsPays', 'GestionsVille','TypeDeDemande','Produits'];
      return !excludedRoutes.includes(this.$route.name);
    },
  },
  methods: {
    emitFilter() {
      this.$emit('filterChanged', this.selectedStatus);
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
/* Styles personnalisés ici */
</style>
