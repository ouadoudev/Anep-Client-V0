import axios from "axios";

const useApiAxios = axios.create({
  baseURL: "https://anep-server.onrender.com",
  withCredentials: false,
});

useApiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

useApiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default useApiAxios;