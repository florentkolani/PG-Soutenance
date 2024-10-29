import axios from 'axios';

export async function createUser(user) {
  const token = localStorage.getItem('token');
  const response = await axios.post('/api/users', user, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
