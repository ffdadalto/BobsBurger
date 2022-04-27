import { createRouter, createWebHistory } from 'vue-router'

import Default from '../views/Default.vue'
import Sobre from '../views/Sobre.vue'
import Pedido from '../views/Pedido.vue'
import Cliente from '../views/Cliente.vue'
import Bairro from '../views/Bairro.vue'
import Cidade from '../views/Cidade.vue'


const routes = [
    { path: '/', component: Default },
    { path: '/Pedido', component: Pedido },
    { path: '/Cliente', component: Cliente },
    { path: '/Bairro', component: Bairro },
    { path: '/Cidade', component: Cidade },
    { path: '/Sobre', component: Sobre }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router