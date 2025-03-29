<template>
  <div class="container mx-auto">
    <!-- Header Component -->
    <Header 
      title="NOVA LEAD" 
      primaryActionText="Envoyer un email" 
      @primaryAction="openEmailModal" 
      @filterAction="openFilterOptions" 
      @goToDashboard="redirectToDashboard"
    />

    <!-- List of sent emails -->
    <main class="container mx-auto px-4 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Emails envoyés</h1>

      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Expéditeur</th> <!-- Add sender column -->
            <th class="border border-gray-300 px-4 py-2">Destinataires</th>
            <th class="border border-gray-300 px-4 py-2">Sujet</th>
            <th class="border border-gray-300 px-4 py-2">Date d'envoi</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-normal">
          <tr v-for="email in sentEmails" :key="email._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="border px-4 py-2">{{ email.senderName || email.sender }}</td> <!-- Fallback to sender if senderName is missing -->
            <td class="border px-4 py-2">
              {{ Array.isArray(email.recipients) ? email.recipients.join(", ") : email.recipients }}
            </td>
            <td class="border px-4 py-2">{{ email.subject }}</td>
            <td class="border px-4 py-2 text-center">
              {{ new Date(email.sentAt).toLocaleString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
              }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <!-- Email Modal -->
    <EmailModal 
      v-if="showEmailModal"
      :showModal="showEmailModal" 
      @close="closeEmailModal"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/layouts/Header.vue";
import EmailModal from '@/components/layouts/EmailModal.vue';
import { API_URL } from '@/services/config';

export default {
  components: {
    Header,
    EmailModal
  },
  data() {
    return {
      sentEmails: [],
      showEmailModal: false,
    };
  },
  methods: {
    async fetchSentEmails() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/emails/sent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.sentEmails = response.data.emails || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des emails envoyés :", error);
      }
    },
    openEmailModal() {
      this.showEmailModal = true; // Vérifiez que cette méthode est bien appelée
    },
    closeEmailModal() {
      this.showEmailModal = false; // Ferme le modal
    },
    openFilterOptions() {
      console.log("Options de filtrage ouvertes");
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
  },
  created() {
    this.fetchSentEmails();
  }
};
</script>
