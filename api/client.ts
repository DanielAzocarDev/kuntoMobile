import axios from 'axios';

// Configuración base de axios para mobile
export const apiClient = axios.create({
  baseURL: 'https://kashin-api-dev.up.railway.app', // Ajusta según tu configuración
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar lógica para obtener el token del store
    // Por ahora lo dejamos simple
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores globales aquí si es necesario
    return Promise.reject(error);
  }
);