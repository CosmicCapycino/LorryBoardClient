import { createApp } from 'vue';
import App from './App.vue';

import router from './router';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

import apiService from "@/services/apiService";

import VueApexCharts from "vue3-apexcharts";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        sets: {
            mdi: {
                defaultSet: 'mdi', // optional if you’re using the default `<v-icon>` wrapper
            },
        },
    }
});

var app = createApp(App);

fetch(process.env.BASE_URL + 'config.json').then((response) => response.json()).then((config) => {
    app.use(router);
    // Everything below here setups up the container regardless of if auth is enabled
    app.use(apiService, true, config.apiServer);
    app.use(VueApexCharts);
    app.use(vuetify);
    app.mount('#app');
});