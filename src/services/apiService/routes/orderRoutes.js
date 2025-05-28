export default class {
    constructor(axios) {
        this.axiosInstance = axios
    }

    async fetchAll() {
        return await this.axiosInstance.get('/orders/fetch/all').then((res) => {
            return res.data;
        })
    }

    async createOrder(form) {
        return await this.axiosInstance.post('/orders/create', form).then((res) => {
            return res.data;
        })
    }

    async updateOrder(id, form) {
        return await this.axiosInstance.put(`/orders/update/${id}`, form).then((res) => {
            return res.data;
        })
    }

    async deleteOrder(id) {
        return await this.axiosInstance.delete(`/orders/delete/${id}`).then((res) => {
            return res.data;
        })
    }
}