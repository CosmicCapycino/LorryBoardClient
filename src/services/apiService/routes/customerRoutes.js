export default class {
    constructor(axios) {
        this.axiosInstance = axios
    }

    async fetchAll() {
        return await this.axiosInstance.get('/customers/fetch/all').then((res) => {
            return res.data;
        })
    }
}