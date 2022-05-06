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
        <div class="grid">
            <div class="col-12 md:col-8 chart">
                <div class="bloco">
                    <div>
                        <DataTable responsiveLayout="scroll">
                            <Column field="horario" header="Horário"></Column>
                            <Column field="numero" header="Número"></Column>
                            <Column field="cliente" header="Cliente"></Column>
                            <Column field="bairro" header="Bairro"></Column>
                            <Column field="valor" header="Valor"></Column>
                            <Column field="situacao" header="Situação"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="bloco">
                    <div>
                        <h1 class="titulo-bairros">Pedidos por Bairro</h1>
                    </div>
                    <Chart
                        type="bar"
                        :data="basicData"
                        :options="horizontalOptions"
                    />
                </div>
            </div>
        </div>
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
            basicData: {
                labels: [
                    "Jardim Tropical",
                    "José de Anchieta",
                    "Larajeiras Velha",
                    "Laranjeiras",
                    "Central Carapina",
                    "Jardim Limoeiro",
                    "São Diogo",
                ],
                datasets: [
                    {
                        label: "Quantidade",
                        backgroundColor: "#42A5F5",
                        data: [15, 7, 3, 1, 16, 10, 22],
                    },
                ],
            },
            horizontalOptions: {
                indexAxis: "y",
                plugins: {
                    legend: {
                        labels: {
                            color: "#495057",
                            font: {
                                size: 16,
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#495057",
                        },
                        grid: {
                            color: "#ebedef",
                        },
                    },
                    y: {
                        ticks: {
                            color: "#495057",
                        },
                        grid: {
                            color: "#ebedef",
                        },
                    },
                },
            },
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
.grid {
    margin-bottom: 30px;
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

.bloco {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
        rgba(0, 0, 0, 0.05) 0px 5px 10px;
    height: 550px;
    background-color: white;
    padding: 10px;
}

.titulo-bairros {
    margin-bottom: 40px;
}
</style>