<template>
    <TituloPagina titulo="Configurações"></TituloPagina>
    <div class="container-fluid">
        <h4>Cadastro da Empresa</h4>
        <Divider></Divider>
        <div class="p-fluid grid formgrid">
            <div class="field col-12 md:col-6">
                <label>Nome da Empresa</label>
                <InputText
                    type="text"
                    v-model="configuracao.nomeEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-5">
                <label>Endereço</label>
                <InputText
                    type="text"
                    v-model="configuracao.enderecoEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-1">
                <label>Número</label>
                <InputNumber
                    v-model="configuracao.numeroEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-5">
                <label>Bairro</label>
                <InputText
                    type="text"
                    v-model="configuracao.bairroEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-4">
                <label>Cidade</label>
                <InputText
                    type="text"
                    v-model="configuracao.cidadeEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-1">
                <label>UF</label>
                <InputMask
                    v-model="configuracao.ufEmpresa"
                    mask="a*"
                    class="uf"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-2">
                <label>CEP</label>
                <InputMask
                    v-model="configuracao.cepEmpresa"
                    mask="99.999-999"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-3">
                <label for="Phone">Telefone Fixo</label>
                <InputMask
                    mask="(99) 9999-9999"
                    v-model="configuracao.telefoneFixoEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-3">
                <label for="Phone">Celular/WhatsApp</label>
                <InputMask
                    mask="(99) 99999-9999"
                    v-model="configuracao.telefoneCelEmpresa"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-3">
                <label>Horário de Abertura</label>
                <InputMask
                    mask="99:99"
                    v-model="configuracao.horarioAtendimentoInicial"
                    slotChar="00:00"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-3">
                <label>Horário de Fechamento</label>
                <InputMask
                    mask="99:99"
                    v-model="configuracao.horarioAtendimentoFinal"
                    slotChar="00:00"
                    :disabled="camposDesativados"
                />
            </div>
            <div class="field col-12 md:col-12">
                <label>Sobre a Empresa</label>
                <Editor
                    v-model="configuracao.sobreEmpresa"
                    editorStyle="height: 320px"
                    :readonly="camposDesativados"
                >
                </Editor>
            </div>
        </div>
        <div class="botoes">
            <Button
                v-if="!camposDesativados"
                label="Salvar"
                icon="pi pi-save"
                class="p-button-success mr-2"
                @click="salvar"
            />
            <Button
                v-else
                label="Editar"
                icon="pi pi-pencil"
                class="p-button-warning mr-2 editar"
                @click="camposDesativados = false"
            />
        </div>
        <Toast position="top-center" />
    </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";
import { baseApiUrl } from "@/global";

const axios = require("axios");

export default {
    name: "Configuracao",
    components: { TituloPagina },
    data() {
        return {
            url: `${baseApiUrl}/configuracao/`,
            configuracao: {},
            loading: false,
            camposDesativados: true,
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
        async salvar() {
            // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
            if (this.configuracao.id) {
                try {
                    this.configuracao.ativo = true;
                    this.configuracao.ufEmpresa =
                        this.configuracao.ufEmpresa.toUpperCase();

                    await axios.put(
                        `${this.url}${this.configuracao.id}`,
                        this.configuracao
                    );

                    this.camposDesativados = true;

                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Configuração atualizada com sucesso`,
                        life: 3000,
                    });
                } catch (error) {
                    console.error(error);
                    this.$toast.add({
                        severity: "error",
                        summary: "Erro",
                        detail: `Não foi possível atualizar a configuração. Erro: ${error}`,
                        life: 3000,
                    });
                } finally {
                    this.loading = false;
                }
            } else {
                // Cadastro
                try {
                    this.configuracao.ativo = true;
                    this.configuracao.ufEmpresa =
                        this.configuracao.ufEmpresa.toUpperCase();

                    await axios.post(this.url, this.configuracao);

                    this.camposDesativados = true;

                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Configuracao Cadastrada com sucesso`,
                        life: 3000,
                    });
                } catch (error) {
                    console.error(error);
                    this.$toast.add({
                        severity: "error",
                        summary: "Erro no cadastro",
                        detail: `Não foi possível cadastrar a configuração. Erro: ${error}`,
                        life: 3000,
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
    },
    async mounted() {
        await this.getConfiguracao();
    },
};
</script>

<style scoped>
.chart {
    background-color: #f4f4f9;
    border-radius: 10px;
}

.p-divider {
    height: 1px;
    background-color: #9ba7af;
}

.uf {
    text-transform: uppercase;
}

.botoes > button.editar {
    color: white;
    background: #ffc107;
}

.botoes > button.editar:hover {
    color: white;
    background: #e0a100;
}
</style>