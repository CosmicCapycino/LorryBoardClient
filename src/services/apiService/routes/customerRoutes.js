export default class {
    constructor(axios) {
        this.axiosInstance = axios
    }

    async fetchAll() {
        return await this.axiosInstance.get('/customers/fetch/all').then((res) => {
            return res.data;
        })
    }

    async fetchStats() {
        return await this.axiosInstance.get('/customers/fetch/stats').then((res) => {
            return res.data;
        })
    }

    async createCustomer(form) {
        return await this.axiosInstance.post('/customers/create', form).then((res) => {
            return res.data;
        })
    }

    async updateCustomer(id, form) {
        return await this.axiosInstance.put(`/customers/update/${id}`, form).then((res) => {
            return res.data;
        })
    }

    async deleteCustomer(id) {
        return await this.axiosInstance.delete(`/customers/delete/${id}`).then((res) => {
            return res.data;
        })
    }
}