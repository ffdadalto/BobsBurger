<template>
    <TituloPagina titulo="Lista de Pedidos"></TituloPagina>
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
                    :disabled="!selectedPedidos || !selectedPedidos.length"
                />
            </template>
        </Toolbar>
        <DataTable
            :value="pedidos"
            responsiveLayout="scroll"
            v-model:selection="selectedPedidos"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} pedidos"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="numero" header="Número" :sortable="true"></Column>
            <Column field="valorTotal" header="valorTotal"></Column>
            <Column field="cliente.nome" header="Cliente"></Column>
            <Column field="dataCadastro" header="Cadastrado em"></Column>
            <Column :exportable="false" style="min-width: 8rem">
                <template #body="slotProps">
                    <Button
                        icon="pi pi-pencil"
                        class="p-button-rounded mr-2 editar"
                        @click="editPedido(slotProps.data)"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeletePedido(slotProps.data)"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="pedidoDialog"
            :style="{ width: '550px' }"
            header="Cadastro de pedidos"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-12">
                    <label for="cliente">Cliente</label>
                    <AutoComplete
                        v-model="clienteSelecionado"
                        :suggestions="clientesFiltrados"
                        @complete="procurarCliente($event)"
                        :dropdown="true"
                        field="nome"
                        forceSelection
                        placeholder="Selecione um cliente"
                    >
                        <template #item="slotProps">
                            <div>{{ slotProps.item.nome }}</div>
                        </template>
                    </AutoComplete>
                    <small
                        class="p-error"
                        v-if="submitted && !clienteSelecionado"
                        >Cliente é obrigatório</small
                    >
                </div>
                <div class="field col-12">
                    <label for="nome">Número do Pedido</label>
                    <InputText
                        id="numero"
                        v-model.trim="pedido.numero"
                        required="true"
                        :class="{ 'p-invalid': submitted && !pedido.numero }"
                    />
                    <small class="p-error" v-if="submitted && pedido.numero"
                        >Número é obrigatório.</small
                    >
                </div>
                <div class="field col-12">
                    <label for="valorTotal">Valor Total</label>
                    <InputText
                        id="valorTotal"
                        v-model.trim="pedido.valorTotal"
                        required="true"
                        :class="{
                            'p-invalid': submitted && !pedido.valorTotal,
                        }"
                    />
                    <small class="p-error" v-if="submitted && pedido.valorTotal"
                        >Valor Total é obrigatório.</small
                    >
                </div>
                <div class="field">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="pedido.ativo"
                        />
                        <label for="ativo">Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="pedido.ativo"
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
                    @click="salvarPedido"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de um unico pedido selecionado -->
        <Dialog
            v-model:visible="deletePedidoDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="pedido"
                    >Você tem certeza que deseja apagar o pedido
                    <b>{{ pedido.numero }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deletePedidoDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deletePedido"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varios pedidos selecionados -->
        <Dialog
            v-model:visible="deletePedidosDialog"
            :style="{ width: '450px' }"
            header="Confirm"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="pedido"
                    >Você tem certeza que deseja apagar os pedidos
                    selecionados?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deletePedidosDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedPedidos"
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
    name: "pedido",
    components: { TituloPagina },
    data() {
        return {
            pedidos: [],
            loading: false,
            pedido: {},
            submitted: false,
            pedidoDialog: false,
            situacaoSelecionada: null,
            deletePedidosDialog: false,
            deletePedidoDialog: false,
            selectedPedidos: null,
            url: `${baseApiUrl}/pedido/`,
            clienteSelecionado: null,
            clientesFiltrados: [],
            clientes: [],
        };
    },
    methods: {
        abrirNovo() {
            this.pedido = {};
            this.pedido.ativo = "1";
            this.submitted = false;
            this.pedidoDialog = true;
        },
        async getPedidos() {
            try {
                const response = await axios.get(this.url);
                this.pedidos = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um pedido selecionado, abre o pop up de deleção de um unico pedido
            if (this.selectedPedidos.length == 1) {
                this.pedido = { ...this.selectedPedidos[0] };
                this.deletePedidoDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de delação de varios pedidos
            else this.deletePedidosDialog = true;
        },
        hideDialog() {
            this.pedidoDialog = false;
            this.submitted = false;
            this.clienteSelecionado = null;
        },
        async salvarPedido() {
            this.submitted = true;
            if (this.pedido.numero && this.clienteSelecionado) {
                // Validação
                if (this.pedido.numero.trim()) {
                    if (this.pedido.id) {
                        // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                        try {
                            this.pedido.clienteId = this.clienteSelecionado.id; // Liga a cidade escolhia ao pedido

                            const res = await axios.put(
                                `${this.url}${this.pedido.id}`,
                                this.pedido
                            );

                            this.getPedidos(); // Refresh na lista

                            this.$toast.add({
                                severity: "success",
                                summary: "Sucesso",
                                detail: `pedido ${this.pedido.numero} atualizado com sucesso!`,
                                life: 3000,
                            });

                            this.pedidoDialog = false; // Fecha o pop up
                            this.pedido = null; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                            this.clienteSelecionado = null; // Limpa o objeto pra na proxima abertura do pop up
                        } catch (error) {
                            console.error(error);
                            this.$toast.add({
                                severity: "error",
                                summary: "Erro",
                                detail: `Não foi possível atualizar o pedido ${this.pedido.numero}!. Erro: ${error}`,
                                life: 3000,
                            });
                        } finally {
                            this.loading = false;
                        }
                    } else {
                        // Cadastro
                        try {
                            this.pedido.clienteId = this.clienteSelecionado.id; // Liga a cidade escolhia ao pedido

                            const response = await axios.post(
                                this.url,
                                this.pedido
                            );

                            this.$toast.add({
                                severity: "success",
                                summary: "Sucesso",
                                detail: `pedido ${this.pedido.numero} Cadastrado com sucesso!`,
                                life: 3000,
                            });

                            this.getPedidos(); // Refresh na lista

                            this.pedidoDialog = false; // Fecha o pop up
                            this.pedido = null; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                            this.clienteSelecionado = null; // Limpa o objeto pra na proxima abertura do pop up
                        } catch (error) {
                            console.error(error);
                            this.$toast.add({
                                severity: "error",
                                summary: "Erro no cadastro",
                                detail: `Não foi possível cadastrar o pedido ${this.pedido.numero}! Erro: ${error}`,
                                life: 3000,
                            });
                        } finally {
                            this.loading = false;
                        }
                    }
                }
            }
        },
        async deletePedido() {
            try {
                const response = await axios.delete(
                    `${this.url}${this.pedido.id}`
                );
                this.pedidos = this.pedidos.filter(
                    (val) => val.id !== this.pedido.id
                );
                this.deletePedidoDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `pedido ${this.pedido.numero} excluído do sistema!`,
                    life: 3000,
                });
                this.pedido = {};
                this.selectedPedidos = null;
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar o pedido ${this.pedido.numero}! Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        confirmDeletePedido(pedido) {
            this.pedido = pedido;
            this.deletePedidoDialog = true;
        },
        // Metodo para deletar varios clientes
        async deleteSelectedPedidos() {
            try {
                let pedidosIds = [];
                this.selectedPedidos.forEach((e) => {
                    pedidosIds.push(e.id);
                });

                const response = await axios.delete(this.url, {
                    data: pedidosIds,
                });

                this.pedidos = this.pedidos.filter(
                    (val) => !this.selectedPedidos.includes(val)
                );

                this.deletePedidosDialog = false;
                this.selectedPedidos = null;
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
                    detail: `Não foi possível excluir os pedidos selecionados! Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        editPedido(pedido) {
            this.submitted = false;
            this.pedido = pedido;
            this.clienteSelecionado = pedido.cliente;
            this.pedido.ativo = pedido.ativo ? "1" : "0";

            this.pedidoDialog = true;
        },
        findIndexById(id) {
            let index = -1;
            for (let i = 0; i < this.pedidos.length; i++) {
                if (this.pedidos[i].id === id) {
                    index = i;
                    break;
                }
            }

            return index;
        },
        procurarCliente(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.clientesFiltrados = [...this.clientes];
                } else {
                    this.clientesFiltrados = this.clientes.filter((cliente) => {
                        return cliente.nome
                            .toLowerCase()
                            .startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },
        async getClientes() {
            try {
                const response = await axios.get(`${baseApiUrl}/cliente/`);
                this.clientes = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.loading = true;
        this.getPedidos();
        this.getClientes();
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