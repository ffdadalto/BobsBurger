<template>
    <TituloPagina titulo="Lista de Cidades"></TituloPagina>
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
                    :disabled="!selectedCidades || !selectedCidades.length"
                />
            </template>
        </Toolbar>
        <DataTable
            :value="cidades"
            responsiveLayout="scroll"
            v-model:selection="selectedCidades"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} cidades"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true"></Column>            
            <Column field="qtdBairros" header="Qtd Bairros"></Column>  
            <Column field="dataCadastro" header="Cadastrado em"></Column>
            <Column field="ativo" header="Ativo">
                <template #body="slotProps">
                    <i
                        class="pi pi-check-circle green-ativo"
                        v-if="slotProps.data.ativo"
                        v-tooltip.top="'Ativo'"
                    ></i>
                    <i
                        class="pi pi-ban red-inativo"
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
                        @click="editCidade(slotProps.data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeleteCidade(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="cidadeDialog"
            :style="{ width: '550px' }"
            header="Cadastro de cidades"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label for="nome">Nome do Cidade</label>
                    <InputText
                        id="nome"
                        v-model.trim="cidade.nome"
                        required="true"
                        autofocus
                        :class="{ 'p-invalid': submitted && !cidade.nome }"
                    />
                    <small class="p-error" v-if="submitted && !cidade.nome"
                        >Name is required.</small
                    >
                </div>
                <div class="field col-6">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="cidade.ativo"
                        />
                        <label for="ativo">Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="cidade.ativo"
                        />
                        <label for="inativo">Inativo</label>
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
                    @click="salvarCidade"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de uma unica cidade selecionado -->
        <Dialog
            v-model:visible="deleteCidadeDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="cidade"
                    >Você tem certeza que deseja apagar o cidade
                    <b>{{ cidade.nome }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteCidadeDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteCidade"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varias cidades selecionadas -->
        <Dialog
            v-model:visible="deleteCidadesDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="cidade"
                    >Você tem certeza que deseja apagar os cidades
                    selecionados?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteCidadesDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedCidades"
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
    name: "Cidade",
    components: { TituloPagina },
    data() {
        return {
            cidades: [],
            loading: false,
            cidade: {},
            submitted: false,
            cidadeDialog: false,
            situacaoSelecionada: null,
            deleteCidadesDialog: false,
            deleteCidadeDialog: false,
            selectedCidades: null,
            url: `${baseApiUrl}/cidade/`,
        };
    },
    methods: {
        abrirNovo() {
            this.cidade = {};
            this.cidade.ativo = "1";
            this.submitted = false;
            this.cidadeDialog = true;
        },
        async getCidades() {
            try {
                const response = await axios.get(this.url);
                this.cidades = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um cidade selecionado, abre o pop up de deleção de um unico cidade
            if (this.selectedCidades.length == 1) {
                this.cidade = this.selectedCidades.shift();
                this.deleteCidadeDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de delação de varios cidades
            else this.deleteCidadesDialog = true;
        },
        hideDialog() {
            this.cidadeDialog = false;
            this.submitted = false;
        },
        async salvarCidade() {
            this.submitted = true;
            if (this.cidade.nome.trim()) {
                if (this.cidade.id) {
                    // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                    try {
                        await axios.put(
                            `${this.url}${this.cidade.id}`,
                            this.cidade
                        );
                        
                        this.getCidades(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Cidade ${this.cidade.nome} atualizado com sucesso`,
                            life: 3000,
                        });

                        this.cidadeDialog = false; // Fecha o pop up
                        this.cidade = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro",
                            detail: `Não foi possível atualizar o cidade ${this.cidade.nome}. Erro: ${error}`,
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
                            this.cidade
                        );

                        this.getCidades(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Cidade ${this.cidade.id} - ${this.cidade.nome} Cadastrado com sucesso`,
                            life: 3000,
                        });

                        this.cidadeDialog = false; // Fecha o pop up
                        this.cidade = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro no cadastro",
                            detail: `Não foi possível cadastrar o cidade ${this.cidade.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                }
            }
        },
        async deleteCidade() {
            try {
                const response = await axios.delete(
                    `${this.url}${this.cidade.id}`
                );
                
                this.getCidades(); // Refresh na lista

                this.deleteCidadeDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Cidade ${this.cidade.nome} excluído do sistema`,
                    life: 3000,
                });
                this.cidade = {};
                this.selectedCidades = null;
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar o cidade ${this.cidade.nome}. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteCidade(cidade) {
            this.cidade = cidade;
            this.deleteCidadeDialog = true;
        },
        // Metodo para deletar varios clientes
        async deleteSelectedCidades() {
            try {
                let cidadesIds = [];
                this.selectedCidades.forEach((e) => {
                    cidadesIds.push(e.id);
                });

                const response = await axios.delete(this.url, {
                    data: cidadesIds,
                });

                this.getCidades(); // Refresh na lista

                this.deleteCidadesDialog = false;
                this.selectedCidades = null;
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
                    detail: `Não foi possível excluir os cidades selecionados. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        editCidade(cidade) {
            this.cidade = cidade;
            this.cidade.ativo = cidade.ativo ? "1" : "0";

            this.cidadeDialog = true;
        },
    },
    mounted() {
        this.loading = true;
        this.getCidades();
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