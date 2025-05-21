import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8085',
    headers: {
    'Content-Type': 'multipart/form-data', // Para enviar arquivos, altere o tipo de conteúdo
  },
})