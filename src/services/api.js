import axios from "axios";

const API = axios.create({

  baseURL: "http://localhost:5000/api"

});



// SEND TOKEN AUTOMATICALLY
API.interceptors.request.use(

  (req) => {

    const token =
      localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (token) {

      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  },

  (error) => {

    return Promise.reject(error);
  }
);

export default API;