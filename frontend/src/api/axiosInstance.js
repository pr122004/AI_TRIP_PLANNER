import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request');
      toast.error('Session expired or unauthorized. Please login.');
      // Do not retry, do not redirect here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
