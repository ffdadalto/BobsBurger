<template>
    <TituloPagina titulo="Lista de Formas de Pagamentos"></TituloPagina>
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
                    :disabled="
                        !selectedFormasPagamentos ||
                        !selectedFormasPagamentos.length
                    "
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
            :value="formasPagamentos"
            responsiveLayout="scroll"
            v-model:selection="selectedFormasPagamentos"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} Formas de Pagamnento"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true"></Column>
            <Column field="taxa" header="Taxa(%)"></Column>
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
                        @click="editFormaPagamento(slotProps.data)"
                        v-tooltip.top="'Editar'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeleteFormaPagamento(slotProps.data)"
                        v-tooltip.top="'Excluir'"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="formaPagamentoDialog"
            :style="{ width: '550px' }"
            header="Cadastro de Formas de Pagamento"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label>Nome</label>
                    <InputText
                        id="nome"
                        v-model.trim="formaPagamento.nome"
                        required="true"
                        autofocus
                        :class="{
                            'p-invalid': submitted && !formaPagamento.nome,
                        }"
                    />
                    <small
                        class="p-error"
                        v-if="submitted && !formaPagamento.nome"
                        >Campo Obrigaórtio.</small
                    >
                </div>
                <div class="field col-6">
                    <label>Taxa (%)</label>
                    <InputText
                        id="nome"
                        v-model="formaPagamento.taxa"
                        required="true"
                        autofocus
                        :class="{
                            'p-invalid': submitted && !formaPagamento.taxa,
                        }"
                    />
                    <small
                        class="p-error"
                        v-if="submitted && !formaPagamento.taxa"
                        >Campo Obrigaórtio.</small
                    >
                </div>
                <div class="field col-6">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="formaPagamento.ativo"
                        />
                        <label>Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="formaPagamento.ativo"
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
                    @click="salvarFormaPagamento"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de uma unica formaPagamento selecionado -->
        <Dialog
            v-model:visible="deleteFormaPagamentoDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="formaPagamento"
                    >Você tem certeza que deseja apagar a Forma de Pagamento
                    <b>{{ formaPagamento.nome }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteFormaPagamentoDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteFormaPagamento"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varias formasPagamentos selecionadas -->
        <Dialog
            v-model:visible="deleteFormasPagamentosDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="formaPagamento"
                    >Você tem certeza que deseja apagar as Formas de Pagamentos
                    selecionadas?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteFormasPagamentosDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedFormasPagamentos"
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
    name: "FormaPagamento",
    components: { TituloPagina },
    data() {
        return {
            formasPagamentos: [],
            loading: false,
            formaPagamento: {},
            submitted: false,
            formaPagamentoDialog: false,
            situacaoSelecionada: null,
            deleteFormasPagamentosDialog: false,
            deleteFormaPagamentoDialog: false,
            selectedFormasPagamentos: null,
            url: `${baseApiUrl}/formaPagamento/`,
            filtro: "todos",
        };
    },
    methods: {
        abrirNovo() {
            this.formaPagamento = {};
            this.formaPagamento.ativo = "1";
            this.submitted = false;
            this.formaPagamentoDialog = true;
        },
        async getFormasPagamentos() {
            switch (this.filtro) {
                case "todos":
                    try {
                        const response = await axios.get(this.url);
                        this.formasPagamentos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "ativos":
                    try {
                        const response = await axios.get(`${this.url}ativo`);
                        this.formasPagamentos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "inativos":
                    try {
                        const response = await axios.get(`${this.url}inativo`);
                        this.formasPagamentos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                default:
                    try {
                        const response = await axios.get(this.url);
                        this.formasPagamentos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um formaPagamento selecionado, abre o pop up de deleção de um unico formaPagamento
            if (this.selectedFormasPagamentos.length == 1) {
                this.formaPagamento = this.selectedFormasPagamentos.shift();
                this.deleteFormaPagamentoDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de delação de varios formasPagamentos
            else this.deleteFormasPagamentosDialog = true;
        },
        hideDialog() {
            this.formaPagamentoDialog = false;
            this.submitted = false;
        },
        async salvarFormaPagamento() {
            this.submitted = true;
            if (this.formaPagamento.nome.trim() && this.formaPagamento.taxa) {
                if (this.formaPagamento.id) {
                    // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                    try {
                        await axios.put(
                            `${this.url}${this.formaPagamento.id}`,
                            this.formaPagamento
                        );

                        this.getFormasPagamentos(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Forma de Pagamento ${this.formaPagamento.nome} atualizada com sucesso`,
                            life: 3000,
                        });

                        this.formaPagamentoDialog = false; // Fecha o pop up
                        this.formaPagamento = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro",
                            detail: `Não foi possível atualizar a Forma de Pagamento ${this.formaPagamento.nome}. Erro: ${error}`,
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
                            this.formaPagamento
                        );

                        this.getFormasPagamentos(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Forma de Pagamento ${this.formaPagamento.nome} cadastrada com sucesso`,
                            life: 3000,
                        });

                        this.formaPagamentoDialog = false; // Fecha o pop up
                        this.formaPagamento = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro no cadastro",
                            detail: `Não foi possível cadastrar a Forma de Pagamento ${this.formaPagamento.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                }
            }
        },
        async deleteFormaPagamento() {
            try {
                const response = await axios.delete(
                    `${this.url}${this.formaPagamento.id}`
                );

                this.getFormasPagamentos(); // Refresh na lista

                this.deleteFormaPagamentoDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Forma de Pagamento ${this.formaPagamento.nome} excluída do sistema`,
                    life: 3000,
                });
                this.formaPagamento = {};
                this.selectedFormasPagamentos = null;
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar a Forma de Pagamento ${this.formaPagamento.nome}. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteFormaPagamento(formaPagamento) {
            this.formaPagamento = formaPagamento;
            this.deleteFormaPagamentoDialog = true;
        },
        // Metodo para deletar varios clientes
        async deleteSelectedFormasPagamentos() {
            try {
                let formasPagamentosIds = [];

                // Loop para pegar os ids das formas de pagamentos seleconadas para exclusão
                this.selectedFormasPagamentos.forEach((e) => {
                    formasPagamentosIds.push(e.id);
                });
                
                // Chama o delete passando o array de Ids
                const response = await axios.delete(this.url, {
                    data: formasPagamentosIds,
                });

                this.getFormasPagamentos(); // Refresh na lista

                this.deleteFormasPagamentosDialog = false;
                this.selectedFormasPagamentos = null;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: response.data.message, // A mensagem foi definida no controller
                    life: 3000,
                });
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: `Não foi possível excluir as Formas de Pagamentos. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        editFormaPagamento(formaPagamento) {
            this.formaPagamento = formaPagamento;
            this.formaPagamento.ativo = formaPagamento.ativo ? "1" : "0";

            this.formaPagamentoDialog = true;
        },
    },
    mounted() {
        this.loading = true;
        this.getFormasPagamentos();
    },
    watch: {
        filtro() {
            this.getFormasPagamentos();
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