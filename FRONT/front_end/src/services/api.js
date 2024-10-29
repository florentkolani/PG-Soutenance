import axios from 'axios';

const API_URL = 'http://localhost:5000/API';

export const fetchTickets = () => axios.get(`${API_URL}/tickets`);
export const fetchTicketById = (id) => axios.get(`${API_URL}/tickets/${id}`);
