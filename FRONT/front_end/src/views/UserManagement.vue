<!-- <template>
    <div class="user-management">
      <h2>Ajout de Client</h2>
      
      <button @click="showAddUserForm = !showAddUserForm">
        {{ showAddUserForm ? 'Annuler' : 'Ajouter un utilisateur' }}
      </button>
  
      <div v-if="showAddUserForm">
        <form @submit.prevent="addUser">
          <input type="text" v-model="newUser.name" placeholder="Nom" required />
          <input type="email" v-model="newUser.email" placeholder="Email" required />
          <input type="password" v-model="newUser.password" placeholder="Mot de passe" required />
          <input type="text" v-model="newUser.contact" placeholder="Contact" required />
          <select v-model="newUser.role">
            <option value="Admin">Admin</option>
            <option value="Client">Client</option>
            <option value="AgentSupport">Agent Support</option>
          </select>
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { createUser } from '@/services/userService';
  
  export default {
    data() {
      return {
        showAddUserForm: false,
        newUser: {
          name: '',
          email: '',
          password: '',
          contact: '',
          role: 'Client'
        }
      };
    },
    methods: {
      async addUser() {
        try {
          await createUser(this.newUser); // Appel à l'API pour ajouter l'utilisateur
          this.newUser = { name: '', email: '', password: '', contact: '', role: 'Client' }; // Réinitialiser le formulaire
          this.showAddUserForm = false; // Masquer le formulaire
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .user-management {
    padding: 20px;
  }
  
  .user-management form {
    margin-block-end: 20px;
  }
  
  .user-management input, .user-management select {
    margin: 5px;
    padding: 10px;
  }
  
  .user-management button {
    margin: 5px;
  }
  </style>
   -->

   <template>
    <div class="user-management">
      <h2>Ajout de Client</h2>
      
      <button @click="showAddUserForm = !showAddUserForm">
        {{ showAddUserForm ? 'Annuler' : 'Ajouter un utilisateur' }}
      </button>
  
      <div v-if="showAddUserForm">
        <form @submit.prevent="addUser">
          <input type="text" v-model="newUser.name" placeholder="Nom" required />
          <input type="email" v-model="newUser.email" placeholder="Email" required />
          <input type="password" v-model="newUser.password" placeholder="Mot de passe" required />
          <input type="text" v-model="newUser.contact" placeholder="Contact" required />
          <select v-model="newUser.role">
            <option value="Admin">Admin</option>
            <option value="Client">Client</option>
            <option value="AgentSupport">Agent Support</option>
          </select>
          <button type="submit">Ajouter</button>
        </form>
      </div>

      <!-- Message de confirmation -->
      <div v-if="confirmationMessage" class="confirmation-message">
        {{ confirmationMessage }}
      </div>
    </div>
</template>

<script>
import { createUser } from '@/services/userService';

export default {
  data() {
    return {
      showAddUserForm: false,
      newUser: {
        name: '',
        email: '',
        password: '',
        contact: '',
        role: 'Client'
      },
      confirmationMessage: '' // Variable pour le message de confirmation
    };
  },
  methods: {
    async addUser() {
      try {
        await createUser(this.newUser); // Appel à l'API pour ajouter l'utilisateur
        this.confirmationMessage = 'Utilisateur ajouté avec succès !'; // Message de confirmation
        this.newUser = { name: '', email: '', password: '', contact: '', role: 'Client' }; // Réinitialiser le formulaire
        this.showAddUserForm = false; // Masquer le formulaire
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        this.confirmationMessage = 'Erreur lors de l\'ajout de l\'utilisateur. Vérifiez les informations.'; // Message d'erreur
      }
    }
  }
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.user-management form {
  margin-block-end: 20px;
}

.user-management input, .user-management select {
  margin: 5px;
  padding: 10px;
}

.user-management button {
  margin: 5px;
}

.confirmation-message {
  margin-block-start: 10px;
  color: green; /* Couleur du message de confirmation */
}
</style>
