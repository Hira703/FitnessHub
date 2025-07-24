// src/hooks/axiosPublic.js
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://server-murex-rho-32.vercel.app", 
});

export default axiosPublic;
