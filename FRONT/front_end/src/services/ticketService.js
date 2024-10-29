import axios from 'axios';

export async function fetchTickets() {
  const token = localStorage.getItem('token');
  const response = await axios.get('/api/tickets', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function closeTicketAPI(ticketId) {
  const token = localStorage.getItem('token');
  const response = await axios.patch(`/api/tickets/${ticketId}/close`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
