import { createRouter, createWebHistory } from 'vue-router'

import Default from '../views/Default.vue'
import Pedido from '../views/Pedido.vue'
import Item from '../views/Item.vue'
import Cliente from '../views/Cliente.vue'
import Bairro from '../views/Bairro.vue'
import Cidade from '../views/Cidade.vue'
import Sobre from '../views/Sobre.vue'


const routes = [
    { path: '/', component: Default },
    { path: '/Pedido', component: Pedido },
    { path: '/Item', component: Item },
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