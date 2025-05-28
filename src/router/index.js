import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import OrdersView from "@/views/OrdersView.vue";
import CustomersView from "@/views/CustomersView.vue";

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: HomeView,
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
        component: HomeView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;