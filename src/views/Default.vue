<template>
    <TituloPagina titulo="Dashboard"></TituloPagina>
    <div class="container-fluid">
        <div class="grid">
            <div class="col-12 md:col-4">
                <div class="card-item green">
                    <div class="card-conteudo">
                        <h1 class="card-valor">36</h1>
                        <p class="card-descricao">Pedidos do dia</p>
                    </div>
                    <div class="card-icone icone-green">
                        <i class="pi pi-chart-line"></i>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="card-item orange">
                    <div class="card-conteudo">
                        <h1 class="card-valor">R$ 3.548.98</h1>
                        <p class="card-descricao">Vendas Totais do dia</p>
                    </div>
                    <div class="card-icone icone-orange">
                        <i class="pi pi-wallet"></i>
                    </div>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="card-item blue">
                    <div class="card-conteudo">
                        <h1 class="card-valor">X-Tudo</h1>
                        <p class="card-descricao">Foi o mais pedido do dia</p>
                    </div>
                    <div class="card-icone icone-blue">
                        <i class="pi pi-star"></i>
                    </div>
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
                            <Column
                                field="formaPagamento.nome"
                                header="Pagamento"
                            ></Column>
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

export default {
    name: "Default",
    components: { TituloPagina },
    data() {
        return {
            url: "/bairro/",
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
                const response = await this.$axios.get(this.url);
                this.bairros = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        getNames() {
            this.bairros.map((v) => {
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
    display: flex;
    flex-wrap: wrap;
}

.card-conteudo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: 80%;
    z-index: 1;
}

.card-valor {
    margin: 0;
    padding: 0;
    font-size: 45px;
    line-height: 35px;
    font-weight: 600;
    width: 100%;
}

.card-icone {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    padding: 0;
    width: 20%;
}

.card-icone i {
    font-size: 100px;
    font-weight: 100;
}

.card-descricao {
    font-size: 20px;
    width: 100%;
    margin: 0;
    padding: 0;
    margin-top: 30px;
}

.green {
    background-color: #52b155;
    border-bottom: 7px solid #318934;
}

.icone-green {
    color: #409142;
}

.orange {
    background-color: #f39c12;
    border-bottom: 7px solid #bf790c;
}

.icone-orange {
    color: #cf8511;
}

.blue {
    background-color: #4cb5f5;
    border-bottom: 7px solid #3786b7;
}

.icone-blue {
    color: #3b96cd;
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