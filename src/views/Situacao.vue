<template>
    <TituloPagina titulo="Lista de Situações"></TituloPagina>
    <div class="container-fluid">
        <Toolbar class="mb-4">
            <template #start>
                <Button
                    label="Novo"
                    icon="pi pi-plus"
                    class="p-button-success mr-2"
                    @click="abrirNovo"
                />
                <Button
                    label="Excuir"
                    icon="pi pi-trash"
                    class="p-button-danger"
                    @click="confirmDeleteSelected"
                    :disabled="!selectedSituacoes || !selectedSituacoes.length"
                />
            </template>
            <template #end>
                <div class="ativo-radio-button">
                    <div class="ativo-radio-button-item">
                        <RadioButton value="todos" v-model="filtro" />
                        <label>Todos</label>
                    </div>
                    <div class="ativo-radio-button-item">
                        <RadioButton value="ativos" v-model="filtro" />
                        <label>Ativos</label>
                    </div>
                    <div class="ativo-radio-button-item">
                        <RadioButton value="inativos" v-model="filtro" />
                        <label>Inativos</label>
                    </div>
                </div>
            </template>
        </Toolbar>
        <DataTable
            :value="situacoes"
            responsiveLayout="scroll"
            v-model:selection="selectedSituacoes"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} situações"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true"></Column>
            <Column field="dataCadastro" header="Cadastrado em"></Column>
            <Column field="ativo" header="Ativo">
                <template #body="slotProps">
                    <i
                        class="pi pi-check-circle ativo"
                        v-if="slotProps.data.ativo"
                        v-tooltip.top="'Ativo'"
                    ></i>
                    <i
                        class="pi pi-ban inativo"
                        v-else
                        v-tooltip.top="'Inativo'"
                    ></i>
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 8rem" header="Ações">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded mr-2 editar"
                        @click="editSituacao(slotProps.data)"
                        v-tooltip.top="'Editar'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeleteSituacao(slotProps.data)"
                        v-tooltip.top="'Excluir'"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="situacaoDialog"
            :style="{ width: '550px' }"
            header="Cadastro de Situações"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label>Nome</label>
                    <InputText
                        id="nome"
                        v-model.trim="situacao.nome"
                        required="true"
                        autofocus
                        :class="{
                            'p-invalid': submitted && !situacao.nome,
                        }"
                    />
                    <small class="p-error" v-if="submitted && !situacao.nome"
                        >Campo Obrigatório.</small
                    >
                </div>
                <div class="field col-6">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="situacao.ativo"
                        />
                        <label>Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="situacao.ativo"
                        />
                        <label>Inativo</label>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="hideDialog"
                />
                <Button
                    label="Salvar"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="salvarSituacao"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de uma unica situação selecionada -->
        <Dialog
            v-model:visible="deleteSituacaoDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="situacao"
                    >Você tem certeza que deseja apagar a Situação
                    <b>{{ situacao.nome }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteSituacaoDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSituacao"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varias situações selecionadas -->
        <Dialog
            v-model:visible="deleteSituacoesDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="situacao"
                    >Você tem certeza que deseja apagar as Situações
                    selecionadas?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteSituacoesDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedSituacoes"
                />
            </template>
        </Dialog>

        <Toast position="top-center" />
    </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";
import { baseApiUrl } from "@/global";

const axios = require("axios");

export default {
    name: "Situacao",
    components: { TituloPagina },
    data() {
        return {
            situacoes: [],
            loading: false,
            situacao: {},
            submitted: false,
            situacaoDialog: false,
            situacaoSelecionada: null,
            deleteSituacoesDialog: false,
            deleteSituacaoDialog: false,
            selectedSituacoes: null,
            url: `${baseApiUrl}/situacao/`,
            filtro: "todos",
        };
    },
    methods: {
        abrirNovo() {
            this.situacao = {};
            this.situacao.ativo = "1";
            this.submitted = false;
            this.situacaoDialog = true;
        },
        async getSituacoes() {
            switch (this.filtro) {
                case "todos":
                    try {
                        const response = await axios.get(this.url);
                        this.situacoes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "ativos":
                    try {
                        const response = await axios.get(`${this.url}ativo`);
                        this.situacoes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "inativos":
                    try {
                        const response = await axios.get(`${this.url}inativo`);
                        this.situacoes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                default:
                    try {
                        const response = await axios.get(this.url);
                        this.situacoes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
            }
        },
        confirmDeleteSelected() {
            // Abre o pop up de deleção de uma unica Situação
            if (this.selectedSituacoes.length == 1) {
                this.situacao = this.selectedSituacoes.shift();
                this.deleteSituacaoDialog = true;
            } // Abre o pop up de delação de varias Situações
            else this.deleteSituacoesDialog = true;
        },
        hideDialog() {
            this.situacaoDialog = false;
            this.submitted = false;
        },
        async salvarSituacao() {
            this.submitted = true;
            if (this.situacao.nome.trim()) {
                if (this.situacao.id) {
                    // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                    try {
                        await axios.put(
                            `${this.url}${this.situacao.id}`,
                            this.situacao
                        );

                        this.getSituacoes(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Situação ${this.situacao.nome} atualizada com sucesso`,
                            life: 3000,
                        });

                        this.situacaoDialog = false; // Fecha o pop up
                        this.situacao = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro",
                            detail: `Não foi possível atualizar a Situacao ${this.situacao.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                } else {
                    // Cadastro
                    try {
                        const response = await axios.post(
                            this.url,
                            this.situacao
                        );

                        this.getSituacoes(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Situação ${this.situacao.nome} cadastrada com sucesso`,
                            life: 3000,
                        });

                        this.situacaoDialog = false; // Fecha o pop up
                        this.situacao = {}; // Limpa o objeto
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro no cadastro",
                            detail: `Não foi possível cadastrar a Situação ${this.situacao.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                }
            }
        },
        async deleteSituacao() {
            try {
                await axios.delete(`${this.url}${this.situacao.id}`);

                this.getSituacoes(); // Refresh na lista

                this.deleteSituacaoDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Situação  ${this.situacao.nome} excluída do sistema`,
                    life: 3000,
                });

                this.situacao = {};
                this.selectedSituacoes = null;

            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar a Situação ${this.situacao.nome}. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteSituacao(situacao) {
            this.situacao = situacao;
            this.deleteSituacaoDialog = true;
        },
        // Metodo para deletar varios clientes
        async deleteSelectedSituacoes() {
            try {
                let situacoesIds = [];

                // Loop para pegar os ids das Situações selecionadas para exclusão
                this.selectedSituacoes.forEach((e) => {
                    situacoesIds.push(e.id);
                });

                // Chama o delete passando o array de Ids
                const response = await axios.delete(this.url, {
                    data: situacoesIds,
                });

                this.getSituacoes(); // Refresh na lista

                this.deleteSituacoesDialog = false;
                this.selectedSituacoes = null;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: response.data.message, // A mensagem definida no controller
                    life: 3000,
                });
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: `Não foi possível excluir as Situações. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        editSituacao(situacao) {
            this.situacao = situacao;
            this.situacao.ativo = situacao.ativo ? "1" : "0";

            this.situacaoDialog = true;
        },
    },
    mounted() {
        this.loading = true;
        this.getSituacoes();
    },
    watch: {
        filtro() {
            this.getSituacoes();
        },
    },
};
</script>

<style scoped>
.editar {
    color: white;
    background: #ffc107;
    border: #ffc107;
}

td > button.editar:hover {
    background: #e0a100;
    border: #e0a100;
}

.excluir {
    color: white;
    background: #dc3545;
    border: #dc3545;
}

td > button.excluir:hover {
    background: #ad2626;
    border: #ad2626;
}
</style>