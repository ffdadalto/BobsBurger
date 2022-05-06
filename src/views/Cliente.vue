<template>
    <TituloPagina titulo="Lista de  Clientes"></TituloPagina>
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
                    :disabled="!selectedClientes || !selectedClientes.length"
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
            :value="clientes"
            responsiveLayout="scroll"
            v-model:selection="selectedClientes"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} clientes"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true"></Column>
            <Column field="telefone" header="Telefone"></Column>
            <Column field="cep" header="CEP"></Column>
            <Column field="endereco" header="Endereço"></Column>
            <Column field="numero" header="Número"></Column>
            <Column field="bairro.nome" header="Bairro"></Column>
            <Column field="cidade.nome" header="Cidade"></Column>
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
                        @click="editCliente(slotProps.data)"
                        v-tooltip.top="'Editar'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeleteCliente(slotProps.data)"
                        v-tooltip.top="'Excluir'"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="clienteDialog"
            :style="{ width: '550px' }"
            header="Cadastro de clientes"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-5">
                    <label>Nome Completo</label>
                    <InputText
                        id="nome"
                        v-model.trim="cliente.nome"
                        required="true"
                        autofocus
                        :class="{ 'p-invalid': submitted && !cliente.nome }"
                    />
                    <small class="p-error" v-if="submitted && !cliente.nome"
                        >Obrigatório.</small
                    >
                </div>
                <div class="field col-4">
                    <label>Telefone</label>
                    <InputText
                        id="telefone"
                        v-model.trim="cliente.telefone"
                        required="true"
                        :class="{ 'p-invalid': submitted && !cliente.telefone }"
                    />
                    <small class="p-error" v-if="submitted && !cliente.telefone"
                        >Obrigatório.</small
                    >
                </div>
                <div class="field col-3">
                    <label>CEP</label>
                    <InputText id="cep" v-model.trim="cliente.cep" />
                </div>
                <div class="field col-7">
                    <label>Endereço</label>
                    <InputText id="endereco" v-model.trim="cliente.endereco" />
                </div>
                <div class="field col-2">
                    <label>Número</label>
                    <InputNumber
                        id="numero"
                        v-model="cliente.numero"
                        integeronly
                    ></InputNumber>
                </div>
                <div class="field col-3">
                    <label>Complemento</label>
                    <InputText
                        id="complemento"
                        v-model.trim="cliente.complemento"
                    />
                </div>
                <div class="field col-6">
                    <label>Cidade</label>
                    <AutoComplete
                        v-model="cidadeSelecionada"
                        :suggestions="cidadesFiltradas"
                        @complete="procurarCidade($event)"
                        :dropdown="true"
                        field="nome"
                        forceSelection
                        :class="{
                            'p-invalid': submitted && !cidadeSelecionada,
                        }"
                        placeholder="Selecione uma cidade"
                        autoHighlight
                        @item-select="cidadeEscolhida"
                    >
                        <template #item="slotProps">
                            <div>{{ slotProps.item.nome }}</div>
                        </template>
                    </AutoComplete>
                    <small
                        class="p-error"
                        v-if="submitted && !cidadeSelecionada"
                        >Obrigatório.</small
                    >
                </div>
                <div class="field col-6">
                    <label>Bairro</label>
                    <AutoComplete
                        v-model="bairroSelecionado"
                        :suggestions="bairrosFiltrados"
                        @complete="procurarBairro($event)"
                        :dropdown="true"
                        field="nome"
                        forceSelection
                        :class="{
                            'p-invalid': submitted && !bairroSelecionado,
                        }"
                        placeholder="Selecione um bairro"
                        autoHighlight
                    >
                        <template #item="slotProps">
                            <div>{{ slotProps.item.nome }}</div>
                        </template>
                    </AutoComplete>
                    <small
                        class="p-error"
                        v-if="submitted && !bairroSelecionado"
                        >Obrigatório.</small
                    >
                </div>

                <div class="field col-12">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="cliente.ativo"
                        />
                        <label>Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="cliente.ativo"
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
                    @click="salvarCliente"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de um unico cliente selecionado -->
        <Dialog
            v-model:visible="deleteClienteDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="cliente"
                    >Você tem certeza que deseja apagar o cliente
                    <b>{{ cliente.nome }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteClienteDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteCliente"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varios clientes selecionados -->
        <Dialog
            v-model:visible="deleteClientesDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="cliente"
                    >Você tem certeza que deseja apagar os clientes
                    selecionados?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteClientesDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedClientes"
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
            url: `${baseApiUrl}/cliente/`,
            cidadeSelecionada: null,
            cidadesFiltradas: [],
            cidades: [],
            bairroSelecionado: null,
            bairrosFiltrados: [],
            bairros: [],
            somenteAtivos: true,
            filtro: "todos",
        };
    },
    methods: {
        async getClientes() {
            switch (this.filtro) {
                case "todos":
                    try {
                        const response = await axios.get(this.url);
                        this.clientes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "ativos":
                    try {
                        const response = await axios.get(`${this.url}ativo`);
                        this.clientes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "inativos":
                    try {
                        const response = await axios.get(`${this.url}inativo`);
                        this.clientes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                default:
                    try {
                        const response = await axios.get(this.url);
                        this.clientes = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
            }
        },
        abrirNovo() {
            this.submitted = false;
            this.cliente = {};
            this.cliente.ativo = "1";
            this.clienteDialog = true;
        },
        hideDialog() {
            this.clienteDialog = false;
            this.submitted = false;
            this.cidadeSelecionada = null;
            this.bairroSelecionado = null;
        },
        async salvarCliente() {
            this.submitted = true;
            // Validações
            if (
                this.cliente.nome &&
                this.cliente.nome.trim() &&
                this.cliente.telefone &&
                this.cliente.telefone.trim() &&
                this.cidadeSelecionada &&
                this.bairroSelecionado
            ) {
                // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                if (this.cliente.id) {
                    try {
                        if (this.bairroSelecionado)
                            this.cliente.bairroId = this.bairroSelecionado.id;

                        if (this.cidadeSelecionada)
                            this.cliente.cidadeId = this.cidadeSelecionada.id;

                        await axios.put(
                            `${this.url}${this.cliente.id}`,
                            this.cliente
                        );

                        this.getClientes(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Cliente ${this.cliente.nome} atualizado com sucesso`,
                            life: 3000,
                        });

                        this.clienteDialog = false; // Fecha o pop up
                        this.cliente = null; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                        this.cidadeSelecionada = null;
                        this.bairroSelecionado = null;
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro",
                            detail: `Não foi possível atualizar o cliente ${this.cliente.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                } else {
                    // Cadastro
                    try {
                        if (this.bairroSelecionado)
                            this.cliente.bairroId = this.bairroSelecionado.id;

                        if (this.cidadeSelecionada)
                            this.cliente.cidadeId = this.cidadeSelecionada.id;

                        await axios.post(this.url, this.cliente);

                        this.getClientes(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Cliente ${this.cliente.nome} Cadastrado com sucesso`,
                            life: 3000,
                        });

                        this.clienteDialog = false; // Fecha o pop up
                        this.cliente = null; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                        this.cidadeSelecionada = null;
                        this.bairroSelecionado = null;
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
                    `${this.url}${this.cliente.id}`
                );
                this.clientes = this.clientes.filter(
                    (val) => val.id !== this.cliente.id
                );
                this.deleteClienteDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Cliente ${this.cliente.nome} excluído do sistema`,
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
            try {
                let clientesIds = [];
                this.selectedClientes.forEach((e) => {
                    clientesIds.push(e.id);
                });

                const response = await axios.delete(this.url, {
                    data: clientesIds,
                });

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
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: `Não foi possível excluir os clientes selecionados. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        async editCliente(cliente) {
            this.submitted = false;
            this.cliente = cliente;
            this.cliente.ativo = cliente.ativo ? "1" : "0";
            this.bairroSelecionado = cliente.bairro;
            this.cidadeSelecionada = cliente.cidade;

            if (cliente.numero != null)
                this.cliente.numero = parseInt(cliente.numero);

            this.clienteDialog = true;
        },
        confirmDeleteCliente(cliente) {
            this.cliente = cliente;
            this.deleteClienteDialog = true;
        },
        procurarCidade(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.cidadesFiltradas = [...this.cidades];
                } else {
                    this.cidadesFiltradas = this.cidades.filter((cidade) => {
                        return cidade.nome
                            .toLowerCase()
                            .startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },
        async getCidades() {
            try {
                const response = await axios.get(`${baseApiUrl}/cidade/`);
                this.cidades = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        procurarBairro(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.bairrosFiltrados = [...this.bairros];
                } else {
                    this.bairrosFiltrados = this.bairros.filter((bairro) => {
                        return bairro.nome
                            .toLowerCase()
                            .startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },
        getBairrosCidade() {
            this.bairros = this.cidadeSelecionada.bairros;
        },
        cidadeEscolhida() {
            this.bairroSelecionado = null;
            this.getBairrosCidade();
        },
    },
    mounted() {
        this.loading = true;
        this.getClientes();
        this.getCidades();
    },
    watch: {
        filtro() {
            this.getClientes();
        },
    },
};
</script>

<style scoped>
.field {
    margin-bottom: 15px;
}

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