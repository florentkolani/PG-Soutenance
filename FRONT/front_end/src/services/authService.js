import axios from 'axios';
import { API_URL } from '@/services/config';


export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
}

export function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = JSON.parse(atob(token.split('.')[1]));
  return decoded.role;
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

//recuperation des info
export function getUserInfo() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = jwt_decode(token);
    const userId = decoded._id;

    return axios.get(`${API_URL}/users/${userId}`).then(response => {
      return response.data;
    }).catch(error => {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      return null;
    });
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }

}