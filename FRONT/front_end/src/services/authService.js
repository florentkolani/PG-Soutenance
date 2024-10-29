import axios from 'axios';


export async function loginUser(credentials) {
  const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
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
//recuperation des info
export function getUserInfo() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = jwt_decode(token);
    const userId = decoded.id;

    // Récupérer les informations utilisateur depuis l'API en utilisant l'ID
    return axios.get(`/api/users/${userId}`).then(response => {
      return response.data; // Retourne les données utilisateur (nom, email)
    }).catch(error => {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      return null;
    });
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
}