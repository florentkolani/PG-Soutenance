<template>
  <div>
    <!-- Modal de notation -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-black bg-opacity-50 absolute inset-0 transition-opacity duration-300" @click="close"></div>
      <div class="bg-white p-8 rounded-lg shadow-2xl w-96 relative transform transition-all duration-300 scale-100">
        <button @click="close"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <i class="fas fa-times text-xl"></i>
        </button>

        <h3 class="text-2xl font-bold mb-6 text-gray-800 text-center">Noter le ticket</h3>
        <p class="text-sm text-gray-600 text-center mb-6">En notant ce ticket, vous le clôturez automatiquement.</p>

        <form @submit.prevent="submitRating" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Note:</label>
            <select v-model="rating.note" required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200">
              <option value="" disabled selected>Choisissez une note</option>
              <option value="Médiocre">Médiocre</option>
              <option value="Passable">Passable</option>
              <option value="Satisfait">Satisfait</option>
              <option value="Très Satisfait">Très Satisfait</option>
            </select>
          </div>

          <div v-if="rating.note === 'Médiocre' || rating.note === 'Passable'"
            class="transition-all duration-300 ease-in-out">
            <label class="block text-gray-700 font-medium mb-2">Commentaire:</label>
            <textarea v-model="rating.commentaire" required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 min-h-[100px]"
              placeholder="Veuillez expliquer la raison de votre insatisfaction..."></textarea>
          </div>

          <div class="flex justify-center space-x-4 pt-4">
            <button type="submit"
              class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              :disabled="alreadyRated">
              <i class="fas fa-check"></i>
              <span>Soumettre</span>
            </button>
            <button @click="close" type="button"
              class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
              <i class="fas fa-times"></i>
              <span>Annuler</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Alert Dialog -->
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-black bg-opacity-50 absolute inset-0 transition-opacity duration-300"></div>
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-80 text-center transform transition-all duration-300 scale-100 relative">
        <p class="text-lg font-semibold mb-4" :class="alertType === 'success' ? 'text-green-600' : 'text-red-600'">
          <i :class="alertType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
          {{ alertMessage }}
        </p>
        <button @click="showAlert = false"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
          OK
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    showModal: Boolean,
    ticketId: String,
    alreadyRated: Boolean,
    ticketType: String, // Add a prop for the type of request
  },
  data() {
    return {
      rating: {
        note: '',
        commentaire: '',
      },
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
    };
  },
  methods: {
    submitRating() {
      if (this.alreadyRated) {
        this.showError("Vous avez déjà noté ce ticket.");
        return;
      }
      this.$emit('submitRating', { ...this.rating, ticketId: this.ticketId });
      this.showSuccess(`Le ticket a été clôturé avec succès.`);
      this.close();
    },

    close() {
      this.$emit('close');
      this.rating.note = '';
      this.rating.commentaire = '';
    },

    showSuccess(message) {
      this.alertType = 'success';
      this.alertMessage = message;
      this.showAlert = true;
    },

    showError(message) {
      this.alertType = 'error';
      this.alertMessage = message;
      this.showAlert = true;
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
