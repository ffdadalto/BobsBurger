import { createRouter, createWebHistory } from 'vue-router'

import Default from '../views/Default.vue'
import Sobre from '../views/Sobre.vue'
import Pedido from '../views/Pedido.vue'
import Cliente from '../views/Cliente.vue'


const routes = [
    { path: '/', component: Default },
    { path: '/Pedido', component: Pedido },
    { path: '/Cliente', component: Cliente },
    { path: '/Sobre', component: Sobre }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router