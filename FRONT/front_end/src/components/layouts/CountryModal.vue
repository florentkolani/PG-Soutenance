<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 w-2/3 shadow-md relative">
      <h2 class="text-xl font-bold mb-4 text-center">Nouveau Pays</h2>
      <form @submit.prevent="save">
        <!-- Nom du pays -->
        <div class="mb-4">
          <label for="country-name" class="block text-sm font-medium text-gray-700">Nom :</label>
          <input 
            id="country-name" 
            v-model="country.name" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
            placeholder="Entrez le nom du pays" 
            required 
          />
        </div>
        <!-- Code du pays -->
        <div class="mb-4">
          <label for="country-code" class="block text-sm font-medium text-gray-700">Code :</label>
          <input 
            id="country-code" 
            v-model="country.code" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
            placeholder="Entrez le code du pays" 
            required 
          />
        </div>
        <!-- Boutons -->
        <div class="flex justify-center space-x-4">
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition-all">
            Enregistrer
          </button>
          <button 
            @click.prevent="$emit('close')" 
            type="button" 
            class="bg-gray-500 hover:bg-gray-300 text-black px-6 py-2 rounded-md shadow-md transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    country: {
      type: Object,
      default: () => ({ name: '', code: '' })
    }
  },
  methods: {
    save() {
      if (this.country.name && this.country.code) {
        this.$emit('save', this.country);
        this.$emit('close');  // Fermer le modal après la sauvegarde
      } else {
        alert('Veuillez remplir tous les champs.');
      }
    }
  }
};
</script>

<style scoped>
/* Styles personnalisés */
</style>
