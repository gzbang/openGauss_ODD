import 'virtual:svg-icons-register';
import '@/shared/styles/base.scss';

import { createApp } from 'vue';
import App from './App.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const app = createApp(App);

app.component('SvgIcon', SvgIcon);

app.mount('#app');
