import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import Message from 'primevue/message';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import RadioButton from 'primevue/radiobutton';
import AutoComplete from 'primevue/autocomplete';
import Tooltip from 'primevue/tooltip';
import InputSwitch from 'primevue/inputswitch';
import Divider from 'primevue/divider';
import InputMask from 'primevue/inputmask';
import Calendar from 'primevue/calendar';
import Editor from 'primevue/editor';

import 'primevue/resources/themes/saga-blue/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.min.css' //icons

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(router);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Toast', Toast);
app.component('Message', Message);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Toolbar', Toolbar);
app.component('Dialog', Dialog);
app.component('InputNumber', InputNumber);
app.component('RadioButton', RadioButton);
app.component('AutoComplete', AutoComplete);
app.component('InputSwitch', InputSwitch);
app.component('Divider', Divider);
app.component('InputMask', InputMask);
app.component('Calendar', Calendar);
app.component('Editor', Editor);

app.directive('tooltip', Tooltip);


app.mount('#app');