<template>
    <TituloPagina titulo="Pagina Clientes"></TituloPagina>
    <div class="container-fluid">
        <Toolbar class="mb-4">
            <template #start>
                <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="abrirNovo" />
                <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected"
                    :disabled="!selectedClientes || !selectedClientes.length" />
            </template>
        </Toolbar>
        <DataTable :value="clientes" responsiveLayout="scroll" v-model:selection="selectedClientes" dataKey="id"
            class="p-datatable-sm" stripedRows :loading="loading" :paginator="true" :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} clientes">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true"></Column>
            <Column field="telefone" header="Telefone"></Column>
            <Column field="cep" header="CEP"></Column>
            <Column field="endereco" header="Endereço"></Column>
            <Column field="numero" header="Número"></Column>
            <Column field="bairro" header="Bairro"></Column>
            <Column field="cidade" header="Cidade"></Column>
            <Column field="dataCadastro" header="Cadastrado em"></Column>
        </DataTable>

        <Dialog v-model:visible="clienteDialog" :style="{ width: '550px' }" header="Cadastro de clientes" :modal="true"
            class="p-fluid">
            <div class="formgrid grid">
                <div class="field col-5">
                    <label for="nome">Nome Completo</label>
                    <InputText id="nome" v-model.trim="cliente.nome" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !cliente.nome }" />
                    <small class="p-error" v-if="submitted && !cliente.nome">Name is required.</small>
                </div>
                <div class="field col-4">
                    <label for="telefone">Telefone</label>
                    <InputText id="telefone" v-model.trim="cliente.telefone" required="true"
                        :class="{ 'p-invalid': submitted && !cliente.telefone }" />
                    <small class="p-error" v-if="submitted && !cliente.telefone">Telefone é Obrigatório.</small>
                </div>
                <div class="field col-3">
                    <label for="cep">CEP</label>
                    <InputText id="cep" v-model.trim="cliente.cep" />
                </div>
                <div class="field col-7">
                    <label for="endereco">Endereço</label>
                    <InputText id="endereco" v-model.trim="cliente.endereco" />
                </div>
                <div class="field col-2">
                    <label for="numero">Número</label>
                    <InputNumber id="numero" v-model="cliente.numero" integeronly></InputNumber>
                </div>
                <div class="field col-3">
                    <label for="complemento">Complemento</label>
                    <InputText id="complemento" v-model.trim="cliente.complemento" />
                </div>
                <div class="field col-6">
                    <label for="bairro">Bairro</label>
                    <InputText id="bairro" v-model.trim="cliente.bairro" />
                </div>
                <div class="field col-6">
                    <label for="cidade">Cidade</label>
                    <InputText id="cidade" v-model.trim="cliente.cidade" />
                </div>

                <div class="field col-12">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton id="ativo" name="situacao" value="1" v-model="cliente.ativo" />
                        <label for="ativo">Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton id="inativo" name="situacao" value="0" v-model="cliente.ativo" />
                        <label for="inativo">Inativo</label>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="salvarCliente" />
            </template>
        </Dialog>

        <!-- Pop up deleção de um unico cliente selecionado -->
        <Dialog v-model:visible="deleteClienteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="cliente">Você tem certeza que deseja apagar o cliente
                    <b>{{ cliente.nome }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteClienteDialog = false" />
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCliente" />
            </template>
        </Dialog>

        <!-- Pop up deleção de varios clientes selecionados -->
        <Dialog v-model:visible="deleteClientesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="cliente">Are you sure you want to delete the selected
                    clientes?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteClientesDialog = false" />
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedClientes" />
            </template>
        </Dialog>

        <Toast position="top-center" />
    </div>
</template>

<script>
import TituloPagina from "@/components/TituloPagina.vue";

const axios = require("axios");

export default {
    name: "Cliente",
    components: { TituloPagina },
    data() {
        return {
            clientes: [],
            loading: false,
            cliente: {},
            submitted: false,
            clienteDialog: false,
            situacaoSelecionada: null,
            deleteClientesDialog: false,
            deleteClienteDialog: false,
            selectedClientes: null,
        };
    },
    methods: {
        async getClientes() {
            try {
                const response = await axios.get(
                    "http://34.205.37.71:8080/api/cliente"
                );
                this.clientes = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        abrirNovo() {
            this.cliente = {};
            this.submitted = false;
            this.clienteDialog = true;
        },
        hideDialog() {
            this.clienteDialog = false;
            this.submitted = false;
        },
        async salvarCliente() {
            this.submitted = true;
            if (this.cliente.nome.trim()) {
                try {
                    const response = await axios.post(
                        "http://localhost:8080/api/cliente",
                        this.cliente
                    );
                    // Captura o id criado pelo banco e alimenta o objeto
                    this.cliente.id = response.data.id;

                    // Captura o datetime now criado pelo controller e alimenta o objeto
                    this.cliente.dataCadastro = response.data.dataCadastro;

                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Cliente ${this.cliente.id} - ${this.cliente.nome} Cadastrado com sucesso`,
                        life: 3000,
                    });

                    this.clienteDialog = false; // Fecha o pop up
                    this.clientes.push(this.cliente); // Adiciona o objeto criado e atualizado na lista
                    this.cliente = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                } catch (error) {
                    console.error(error);
                    this.$toast.add({
                        severity: "error",
                        summary: "Erro no cadastro",
                        detail: `Não foi possível cadastrar o cliente ${this.cliente.nome}. Erro: ${error}`,
                        life: 3000,
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um cliente selecionado, abre o pop up de deleção de um unico cliente
            if (this.selectedClientes.length == 1) {
                this.cliente = { ...this.selectedClientes[0] };
                this.deleteClienteDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de delação de varios clientes
            else this.deleteClientesDialog = true;
        },

        // Metodo para deletar um unico cliente
        async deleteCliente() {
            try {
                const response = await axios.delete(
                    `http://localhost:8080/api/cliente/${this.cliente.id}`
                );
                this.clientes = this.clientes.filter(
                    (val) => val.id !== this.cliente.id
                );
                this.deleteClienteDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Cliente ${this.cliente.nome} excluido do sistema`,
                    life: 3000,
                });
                this.cliente = {};
                this.selectedClientes = null;
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar o cliente ${this.cliente.nome}. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },

        // Metodo para deletar varios clientes
        async deleteSelectedClientes() {
            // if (this.selectedClientes.length > 0) {
            //     try {
            let clientesIds = [];
            this.selectedClientes.forEach((e) => {
                clientesIds.push(e.id);
            });

            console.log(clientesIds);
            const response = await axios.delete(
                "http://localhost:8080/api/cliente", { data: clientesIds }
            );

            this.clientes = this.clientes.filter(
                (val) => !this.selectedClientes.includes(val)
            );

            this.deleteClientesDialog = false;
            this.selectedClientes = null;
            this.$toast.add({
                severity: "success",
                summary: "Sucesso",
                // detail: "Os clientes selecionados foram excluídos dos sistema",
                detail: response.data.message, // A mensagem foi definida no controller
                life: 3000,
            });

            // } catch (error) {
            //     console.error(error);
            //     this.$toast.add({
            //         severity: "error",
            //         summary: "Erro",
            //         detail: `Não foi possível excluir os clientes selecionados. Erro: ${error}`,
            //         life: 3000,
            //     });
            // } finally {
            //     this.loading = false;
            // }
            // }
        },
    },
    mounted() {
        this.loading = true;
        this.getClientes();
    },
};
</script>

<style scoped>
.field {
    margin-bottom: 15px;
}
</style>