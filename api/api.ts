import axios from 'axios'

export const api = axios.create({
    baseURL: "http:10.160.180.119:3000"
})