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
import Erro404 from '../views/404.vue'
import Login from '../views/login.vue'

const routes = [
    { path: '/', component: Default, name: 'home' },
    { path: '/Pedido', component: Pedido },
    { path: '/Item', component: Item },
    { path: '/Situacao', component: Situacao },
    { path: '/Cliente', component: Cliente },
    { path: '/FormaPagamento', component: FormaPagamento },
    { path: '/Bairro', component: Bairro },
    { path: '/Cidade', component: Cidade },
    { path: '/Configuracao', component: Configuracao },
    { path: '/Sobre', component: Sobre },
    { path: '/Erro404', component: Erro404 },
    {
        path: '/Login',
        components: {
            login: Login
        }
    },

    { path: '/:catchAll(.*)', redirect: '/Erro404' } // Qualquer url invalida é redirecionada para a pagina de Error 404
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router