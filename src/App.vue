<template>
    <div class="estrutura-portal" v-if="usuarioLogado">
        <header>
            <Cabecalho></Cabecalho>
        </header>
        <aside>
            <MenuLateral></MenuLateral>
        </aside>
        <div class="content">
            <router-view></router-view>
        </div>
        <footer>
            <Rodape></Rodape>
        </footer>
    </div>
    <router-view v-else name="login"></router-view>
    <router-view name="usuarioCadastro"></router-view>
</template>

<script>
import Cabecalho from "@/components/Cabecalho.vue";
import Rodape from "@/components/Rodape.vue";
import MenuLateral from "@/components/MenuLateral.vue";

export default {
    components: {
        Cabecalho,
        Rodape,
        MenuLateral,
    },
    data() {
        return {            
        };
    },
    computed: {
        usuarioLogado() {
            return this.$store.state.usuarioLogado;
        },
    },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");

:root {
    --cor-header: #2f4550;
    --cor-menu-pri: #586f7c;
    --cor-menu-sec: #6894ad;
    --cor-content: #f4f4f9;
    --cor-container: #fbfefb;
    --cor-rodape: #212f36;

    --cor-letra-menu: #e5eef3;
    --cor-letra-admin: black;
    --cor-letra-titulo: #2f4550;
    --cor-letra-rodape: #fbfefbbf;

    --header-height: 150px;
    --footer-height: 180px;
    --menu-width: 270px;
}

* {
    box-sizing: border-box;
    text-decoration: none;
    margin: 0;
    padding: 0;
    font-family: "Montserrat", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.estrutura-portal {
    display: grid;
    grid-template-columns: var(--menu-width) 1fr;
    grid-template-rows: var(--header-height) 1fr var(--footer-height);
    grid-template-areas:
        "cabecalho cabecalho"
        "menu-lateral container"
        "rodape rodape";
}

header {
    background-color: var(--cor-header);
    grid-area: cabecalho;
    z-index: 1;
    -webkit-box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.75);
}

aside {
    background: linear-gradient(
        to right,
        var(--cor-menu-pri),
        var(--cor-menu-sec)
    );
    grid-area: menu-lateral;
    width: var(--menu-width);
}

.content {
    grid-area: container;
    background-color: var(--cor-content);
    min-height: calc(100vh - (var(--header-height) + var(--footer-height)));
    padding: 20px;
}

.container-fluid {
    background-color: var(--cor-container);
    -webkit-box-shadow: 0px 0px 10px -7px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 10px -7px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 10px -7px rgba(0, 0, 0, 0.75);
    padding: 20px;
}

footer {
    background-color: var(--cor-rodape);
    grid-area: rodape;
}
/* Tamanhon do fonte das listas */
.p-datatable table {
    font-size: 0.8rem;
}

.ativo {
    color: #689f38;
    font-weight: 900 !important;
}

.inativo {
    color: #dc3545;
    font-weight: 900 !important;
}

.ativo-radio-button {
    display: flex;
    justify-content: center;
    align-items: center;
}

.ativo-radio-button-item {
    margin-left: 20px;
}

.ativo-radio-button-item > label {
    margin-left: 10px;
}

.situacao-badge {
    color: white;
    border-radius: 5px;
    padding: 0.25em 0.5rem;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3px;
}
</style>
