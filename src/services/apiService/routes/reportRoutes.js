export default class {
    constructor(axios) {
        this.axiosInstance = axios
    }

    async fetchStatusStatistics() {
        return await this.axiosInstance.get("/reports/statusPie").then((res) => {
            return res.data;
        })
    }

    async fetchOnTimeStatistics() {
        return await this.axiosInstance.get("/reports/onTimePie").then((res) => {
            return res.data;
        })
    }

    async fetchPreviousWeek() {
        return await this.axiosInstance.get("/reports/previousWeek").then((res) => {
            return res.data;
        })
    }

    async fetchRecent() {
        return await this.axiosInstance.get("/reports/recent").then((res) => {
            return res.data;
        })
    }
}