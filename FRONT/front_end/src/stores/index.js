import { createStore } from 'vuex';

export default createStore({
  state: {
    tickets: []
  },
  mutations: {
    setTickets(state, tickets) {
      state.tickets = tickets;
    }
  },
  actions: {
    fetchTickets({ commit }) {
      // Ici tu fais une requête API pour récupérer les tickets et tu les commites
      // Exemple :
      // axios.get('/api/tickets').then(response => {
      //   commit('setTickets', response.data);
      // });
    }
  }
});
