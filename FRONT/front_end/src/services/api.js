import axios from 'axios';

const API_URL = 'http://192.168.1.70:5000/API';

export const fetchTickets = () => axios.get(`${API_URL}/tickets`);
export const fetchTicketById = (id) => axios.get(`${API_URL}/tickets/${id}`);
