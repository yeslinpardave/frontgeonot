import axios from 'axios'

const api = axios.create({
    baseURL:"https://servergeonot.up.railway.app"
})

export default api