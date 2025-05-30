import {createRouter, createWebHistory} from 'vue-router'
import OrdersView from "@/views/OrdersView.vue";
import CustomersView from "@/views/CustomersView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: DashboardView,
    },
    {
        path: '/orders',
        name: 'Orders',
        component: OrdersView,
    },
    {
        path: '/customers',
        name: 'Customers',
        component: CustomersView,
    },
    {
        path: '/admin',
        name: 'Admin',
        component: DashboardView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;