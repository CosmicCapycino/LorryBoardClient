import axios from "axios";
import orderRoutes from "./routes/orderRoutes";
import customerRoutes from "@/services/apiService/routes/customerRoutes";
import reportRoutes from "@/services/apiService/routes/reportRoutes";

const axiosInstance = axios.create();
const orders = new orderRoutes(axiosInstance);
const customers = new customerRoutes(axiosInstance);
const reports = new reportRoutes(axiosInstance);

function configureService(apiConfig) {
    axiosInstance.defaults.baseURL = (apiConfig.ssl ? 'https' : 'http') + "://" + apiConfig.host + (apiConfig.port !== null ? `:${apiConfig.port}` : null);
}

function install(app, useAuth = false, config) {
    app.config.globalProperties.$apiService = this;
    if(app.config.globalProperties.$apiService === this) {
        console.log("API service installed!")
    }
    if(useAuth) {
        console.log("Enabling auth...");
        //const userStore = useUserStore();
        //userStore.setToken(app.config.globalProperties.$cookies.get("token"));
        //axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userStore.token}`;
    }

    configureService(config)
}

const apiService = {
    install,
    orders,
    customers,
    reports,
}

export default apiService;
