<template>
  <header class="bg-lime-500 p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo avec redirection vers le Dashboard -->
      <div class="flex items-center space-x-2 cursor-pointer" @click="goToDashboard">
        <img :src="logo" alt="Logo" class="h-10" />
        <span class="text-white text-xl font-bold">{{ title }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          v-if="primaryActionText" 
          @click="$emit('primaryAction')" 
          class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
        > 
        {{ primaryActionText }} <span class="ml-1">+</span>
        </button>
        <button 
          v-if="filterAction" 
          @click="$emit('filterAction')" 
          class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition flex items-center"
        >
          Filtrer
          <select 
            id="itemFilter" 
            v-model="selectedStatus" 
            @change="emitFilter" 
            class="bg-green-700 text-gray-700 px-0 py-0 rounded-md text-center">
            <option value="">Tous</option>
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </button>
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
