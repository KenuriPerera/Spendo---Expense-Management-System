import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/Expenses", // Matches backend
});

export default API;
