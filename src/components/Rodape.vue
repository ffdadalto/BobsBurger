<template>
    <div class="rodape">
        <h1>{{ configuracao.nomeEmpresa }} © {{ anoCorrente }}</h1>
        <Divider layout="vertical" align="center"> </Divider>
        <div class="info-empresa">
            <!-- <p id="titulo">
                <b>{{ configuracao.nomeEmpresa }}</b>
            </p> -->
            <p>
                <i class="pi pi-map-marker"></i
                >{{ configuracao.enderecoEmpresa }},
                {{ configuracao.numeroEmpresa }}
            </p>
            <p>
                <i class="pi pi-map"></i>{{ configuracao.bairroEmpresa }},
                {{ configuracao.cidadeEmpresa }}, {{ configuracao.ufEmpresa }} -
                {{ configuracao.cepEmpresa }}
            </p>
            <p>
                <i class="pi pi-phone"></i>Telefone:
                {{ configuracao.telefoneFixoEmpresa }}
            </p>
            <p>
                <i class="pi pi-whatsapp"></i>WhatsApp:
                {{ configuracao.telefoneCelEmpresa }}
            </p>
            <p>
                <i class="pi pi-clock"></i>Horario de Atendimento:
                {{ configuracao.horarioAtendimentoInicial }} às
                {{ configuracao.horarioAtendimentoFinal }}
            </p>
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from "@/global";
const axios = require("axios");

export default {
    name: "Rodape",
    props: {},
    data() {
        return {
            url: `${baseApiUrl}/configuracao/`,
            configuracao: {},
            anoCorrente: new Date().getFullYear(),
        };
    },
    methods: {
        async getConfiguracao() {
            try {
                const response = await axios.get(this.url);

                if (response.data.length > 0)
                    this.configuracao = response.data.shift();

                // Parse pra tirar um warning do console
                if (this.configuracao.numeroEmpresa != null)
                    this.configuracao.numeroEmpresa = parseInt(
                        this.configuracao.numeroEmpresa
                    );
            } catch (error) {
                console.error(error);
            }
        },
    },
    async mounted() {
        await this.getConfiguracao();
    },
};
</script>

<style scoped>
.rodape {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--cor-letra-rodape);
    padding: 30px;
}

.rodape > h1 {
    margin: 0;
}

/* Barra vertical do rodapé */
.p-divider-vertical {
    border: 1px solid white;
    margin: 0 50px !important;
}

.info-empresa > p {
    margin-bottom: 3px;
    padding: 0;
    font-size: 12px;
}
.info-empresa > #titulo {
    margin-bottom: 10px;
    font-weight: 400;
    font-size: 18px;
}

.info-empresa > p > i {
    margin-right: 10px;
}
</style>
