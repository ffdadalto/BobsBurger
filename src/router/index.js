import { createRouter, createWebHistory } from 'vue-router'

import Default from '../views/Default.vue'
import Pedido from '../views/Pedido.vue'
import Item from '../views/Item.vue'
import Situacao from '../views/Situacao.vue'
import Cliente from '../views/Cliente.vue'
import FormaPagamento from '../views/FormaPagamento.vue'
import Bairro from '../views/Bairro.vue'
import Cidade from '../views/Cidade.vue'
import Configuracao from '../views/Configuracao.vue'
import Sobre from '../views/Sobre.vue'

const routes = [
    { path: '/', component: Default },
    { path: '/Pedido', component: Pedido },
    { path: '/Item', component: Item },
    { path: '/Situacao', component: Situacao },
    { path: '/Cliente', component: Cliente },
    { path: '/FormaPagamento', component: FormaPagamento },
    { path: '/Bairro', component: Bairro },
    { path: '/Cidade', component: Cidade },
    { path: '/Configuracao', component: Configuracao },
    { path: '/Sobre', component: Sobre }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router