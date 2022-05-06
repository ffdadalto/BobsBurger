<template>
    <TituloPagina titulo="Dashboard"></TituloPagina>
    <div class="container-fluid">
        <div class="grid">
            <div class="col-12 md:col-4">
                <div class="card-item green">
                    <h1 class="valor">36</h1>
                    <p class="valor-descricao">Pedidos do dia</p>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="card-item orange">
                    <h1 class="valor">R$ 2.354,59</h1>
                    <p class="valor-descricao">Receita bruta do dia</p>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="card-item blue">
                    <h1 class="valor">X-Tudo</h1>
                    <p class="valor-descricao">Foi o mais pedido do dia</p>
                </div>
            </div>
        </div>
        <!-- <div class="grid">
            <div class="col-12 md:col-8 chart">
                <div class="grid">
                    <div class="col-12 md:col-12">
                        <div class="box">Cacete</div>
                    </div>
                    <div class="col-12 md:col-12">
                        <div class="box">Cacete</div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="box">Cacete</div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="box">Cacete</div>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="box pedidos">Cacete</div>
            </div>
        </div> -->
    </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";
import { baseApiUrl } from "@/global";

const axios = require("axios");

export default {
    name: "Default",
    components: { TituloPagina },
    data() {
        return {
            url: `${baseApiUrl}/bairro/`,
            bairros: [],
            nomesBairros: [],
        };
    },
    methods: {
        async getBairros() {
            try {
                const response = await axios.get(this.url);
                this.bairros = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        getNames() {
            let aux = this.bairros.map((v) => {
                return v.nome;
            });
        },
    },
    async mounted() {
        await this.getBairros();
        await this.getNames();
    },
};
</script>

<style scoped>
.box {
    background-color: red;
}

.pedidos {
    height: 100%;
}

.card-item {
    height: 150px;
    padding: 30px 20px;
    color: #fbfefb;
    -webkit-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.35);
    -moz-box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.35);
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.35);
    border-radius: 5px;
}

.green {
    background-color: #52b155;
    border-bottom: 7px solid #318934;
}

.orange {
    background-color: #f39c12;
    border-bottom: 7px solid #bf790c;
}

.blue {
    background-color: #4cb5f5;
    border-bottom: 7px solid #3786b7;
}

.valor {
    margin: 0;
    padding: 0;
    font-size: 50px;
    line-height: 35px;
    font-weight: 600;
}

.valor-descricao {
    margin-top: 30px;
    font-size: 22px;
}
</style>