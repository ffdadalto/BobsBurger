<template>
    <TituloPagina titulo="Configurações"></TituloPagina>
    <div class="container-fluid">
        <h4>Cadastro da Empresa</h4>
        <Divider></Divider>
        <div class="p-fluid grid formgrid">
            <div class="field col-12 md:col-5">
                <label>Nome da Empresa</label>
                <InputText
                    type="text"
                    v-model="configuracao.nomeEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.nomeEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.nomeEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-5">
                <label>Endereço</label>
                <InputText
                    type="text"
                    v-model.trim="configuracao.enderecoEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.enderecoEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.enderecoEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-2">
                <label>Número</label>
                <InputNumber
                    v-model.trim="configuracao.numeroEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.numeroEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.numeroEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-5">
                <label>Bairro</label>
                <InputText
                    type="text"
                    v-model.trim="configuracao.bairroEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.bairroEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.bairroEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-4">
                <label>Cidade</label>
                <InputText
                    type="text"
                    v-model.trim="configuracao.cidadeEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.cidadeEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.cidadeEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-1">
                <label>UF</label>
                <InputMask
                    v-model.trim="configuracao.ufEmpresa"
                    mask="a*"
                    class="uf"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.ufEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.ufEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-2">
                <label>CEP</label>
                <InputMask
                    v-model.trim="configuracao.cepEmpresa"
                    mask="99.999-999"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid': submitted && !configuracao.cepEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.cepEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-3">
                <label>Telefone Fixo</label>
                <InputMask
                    mask="(99) 9999-9999"
                    v-model.trim="configuracao.telefoneFixoEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid':
                            submitted && !configuracao.telefoneFixoEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.telefoneFixoEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-3">
                <label>Celular/WhatsApp</label>
                <InputMask
                    mask="(99) 99999-9999"
                    v-model.trim="configuracao.telefoneCelEmpresa"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid':
                            submitted && !configuracao.telefoneCelEmpresa,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.telefoneCelEmpresa"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-3">
                <label>Horário de Abertura</label>
                <InputMask
                    mask="99:99"
                    v-model.trim="configuracao.horarioAtendimentoInicial"
                    slotChar="00:00"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid':
                            submitted &&
                            !configuracao.horarioAtendimentoInicial,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.horarioAtendimentoInicial"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-3">
                <label>Horário de Fechamento</label>
                <InputMask
                    mask="99:99"
                    v-model.trim="configuracao.horarioAtendimentoFinal"
                    slotChar="00:00"
                    :disabled="camposDesativados"
                    :class="{
                        'p-invalid':
                            submitted && !configuracao.horarioAtendimentoFinal,
                    }"
                />
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.horarioAtendimentoFinal"
                    >Campo obrigatório.</small
                >
            </div>
            <div class="field col-12 md:col-12">
                <label>Sobre a Empresa</label>
                <Editor
                    v-model.trim="configuracao.sobreEmpresa"
                    editorStyle="height: 320px"                    
                    :class="{
                        'p-invalid': submitted && !configuracao.sobreEmpresa,
                    }"
                >
                </Editor>
                <small
                    class="p-error"
                    v-if="submitted && !configuracao.sobreEmpresa"
                    >Campo obrigatório.</small
                >
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
            submitted: false,
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
            this.submitted = true;
            if (this.isComplete()) {
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
            }
        },
        isComplete() {
            return (
                this.configuracao.numeroEmpresa &&
                this.configuracao.enderecoEmpresa &&
                this.configuracao.numeroEmpresa &&
                this.configuracao.bairroEmpresa &&
                this.configuracao.cidadeEmpresa &&
                this.configuracao.ufEmpresa &&
                this.configuracao.cepEmpresa &&
                this.configuracao.telefoneFixoEmpresa &&
                this.configuracao.telefoneCelEmpresa &&
                this.configuracao.horarioAtendimentoInicial &&
                this.configuracao.horarioAtendimentoFinal &&
                this.configuracao.sobreEmpresa
            );
        },
    },
    async mounted() {
        await this.getConfiguracao();
        if (this.configuracao.id == null) this.camposDesativados = false;
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