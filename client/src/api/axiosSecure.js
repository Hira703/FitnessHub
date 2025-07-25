import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL:"http://localhost:5000",
});

// Helper to get fresh token
const getFreshToken = () => {
  const auth = getAuth();
  return new Promise((resolve) => {
    const user = auth.currentUser;
    if (user) {
      user.getIdToken(true).then(resolve); // force refresh
    } else {
      onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
          newUser.getIdToken(true).then(resolve); // force refresh
        } else {
          resolve(null);
        }
      });
    }
  });
};

// Regular token fetch (without force refresh)
const getToken = () => {
  const auth = getAuth();
  return new Promise((resolve) => {
    const user = auth.currentUser;
    if (user) {
      user.getIdToken().then(resolve); // no force
    } else {
      onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
          newUser.getIdToken().then(resolve);
        } else {
          resolve(null);
        }
      });
    }
  });
};

// Request interceptor (no force refresh unless retry)
axiosSecure.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: retry on 401 with refreshed token
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const freshToken = await getFreshToken();
        if (freshToken) {
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axiosSecure(originalRequest); // Retry original request
        }
      } catch (err) {
        console.warn("❌ Token refresh failed");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;