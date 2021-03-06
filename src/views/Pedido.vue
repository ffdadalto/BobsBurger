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
            <Column field="cliente.nome" header="Cliente"></Column>
            <Column field="valorTotal" header="Valor">
                <!-- <template #body="{ data }">
                    <span>{{ data.valorTotal | brl }}</span>
                </template> -->
            </Column>
            <Column field="formaPagamento.nome" header="Pagamento"></Column>
            <Column field="situacao.nome" header="Situação">
                <template #body="{ data }">
                    <span
                        class="situacao-badge"
                        :style="'background-color: #' + data.situacao.cor + ';'"
                        >{{ data.situacao.nome }}</span
                    >
                </template>
            </Column>
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
                        @click="editPedido(slotProps.data)"
                        v-tooltip.top="'Editar'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeletePedido(slotProps.data)"
                        v-tooltip.top="'Excluir'"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="pedidoDialog"
            :style="{ width: '900px' }"
            header="Cadastro de pedidos"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-2">
                    <label>Número</label>
                    <InputText
                        id="numero"
                        v-model.trim.number="pedido.numero"
                        required="true"
                        :class="{
                            'p-invalid': submitted && pedido.numero == 0,
                        }"
                        disabled="true"
                    />
                    <small
                        class="p-error"
                        v-if="submitted && pedido.numero == 0"
                        >Obrigatório.</small
                    >
                </div>
                <div class="field col-6">
                    <label>Cliente</label>
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
                        >Obrigatório</small
                    >
                </div>
                <div class="field col-4">
                    <label>Situação do Pedido</label>
                    <AutoComplete
                        v-model="situacaoSelecionada"
                        :suggestions="situacoesFiltradas"
                        @complete="procurarSituacao($event)"
                        :dropdown="true"
                        field="nome"
                        forceSelection
                        placeholder="Selecione uma..."
                    >
                        <template #item="slotProps">
                            <div>{{ slotProps.item.nome }}</div>
                        </template>
                    </AutoComplete>
                    <small
                        class="p-error"
                        v-if="submitted && !situacaoSelecionada"
                        >Obrigatório.</small
                    >
                </div>
                <div class="field col-12">
                    <hr />
                </div>
                <div class="field col-1">
                    <InputText v-model.trim="itemNovo.qtd" placeholder="Qtd" />
                </div>
                <div class="field col-6">
                    <InputText
                        v-model.trim="itemNovo.produto"
                        autofocus
                        placeholder="Produto"
                    />
                </div>
                <div class="field col-1">
                    <Button icon="pi pi-check" @click="addItem" />
                </div>
                <div class="field col-12">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Qtd</th>
                                <th scope="col">Item</th>
                                <th scope="col">P. Unit.</th>
                                <th scope="col">P. Total</th>
                            </tr>
                        </thead>
                        <tbody v-if="itensPedido.length > 0">
                            <tr v-for="(item, i) in itensPedido" :key="i">
                                <th scope="row">{{ i + 1 }}</th>
                                <td>{{ item.qtd }}</td>
                                <td>{{ item.produto }}</td>
                                <td>{{ item.vUnit }}</td>
                                <td>{{ item.vTotal }}</td>
                                <td>
                                    <Button
                                        icon="pi pi-times"
                                        class="
                                            p-button-rounded
                                            p-button-danger
                                            p-button-text
                                        "
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                
                <div class="field col-3">
                    <label>Valor Total</label>
                    <InputText
                        id="valorTotal"
                        v-model.trim="pedido.valorTotal"
                        required="true"
                    />
                </div>
                <div class="field col-6">
                    <label>Pagamento</label>
                    <AutoComplete
                        v-model="formaPagamentoSelecionado"
                        :suggestions="formasPagamentosFiltrados"
                        @complete="procurarFormaPagamento($event)"
                        :dropdown="true"
                        field="nome"
                        forceSelection
                        placeholder="Selecione uma..."
                    >
                        <template #item="slotProps">
                            <div>{{ slotProps.item.nome }}</div>
                        </template>
                    </AutoComplete>
                    <small
                        class="p-error"
                        v-if="submitted && !formaPagamentoSelecionado"
                        >Obrigatório.</small
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
                        <label>Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="pedido.ativo"
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
                    @click="salvarPedido"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de um unico pedido selecionado -->
        <Dialog
            v-model:visible="deletePedidoDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
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
            header="Confirmação"
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
            deletePedidosDialog: false,
            deletePedidoDialog: false,
            selectedPedidos: null,
            url: "/pedido/",
            clienteSelecionado: null,
            formaPagamentoSelecionado: null,
            situacaoSelecionada: null,
            clientesFiltrados: [],
            formasPagamentosFiltrados: [],
            situacoesFiltradas: [],
            clientes: [],
            formasPagamentos: [],
            situacoes: [],
            filtro: "todos",
            itemNovo: {},
            itensPedido: [],
        };
    },
    methods: {
        abrirNovo() {
            this.pedido = {};
            this.pedido.ativo = "1";
            this.pedido.numero = this.ultimoPedido() + 1;
            this.submitted = false;
            this.pedidoDialog = true;
        },
        async getPedidos() {
            switch (this.filtro) {
                case "todos":
                    try {
                        const response = await this.$axios.get(this.url);
                        this.pedidos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "ativos":
                    try {
                        const response = await this.$axios.get(
                            `${this.url}ativo`
                        );
                        this.pedidos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "inativos":
                    try {
                        const response = await this.$axios.get(
                            `${this.url}inativo`
                        );
                        this.pedidos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                default:
                    try {
                        const response = await this.$axios.get(this.url);
                        this.pedidos = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um pedido selecionado, abre o pop up de deleção de um unico pedido
            if (this.selectedPedidos.length == 1) {
                this.pedido = this.selectedPedidos.shift();
                this.deletePedidoDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de deleção de varios pedidos
            else this.deletePedidosDialog = true;
        },
        hideDialog() {
            this.pedidoDialog = false;
            this.submitted = false;
            this.pedido = null;
            this.clienteSelecionado = null;
            this.formaPagamentoSelecionado = null;
            this.situacaoSelecionada = null;
        },
        async salvarPedido() {
            this.submitted = true;

            // Validação
            if (this.isValid()) {
                if (this.pedido.id) {
                    // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                    try {
                        this.pedido.clienteId = this.clienteSelecionado.id; // Liga a cidade

                        this.pedido.formaPagamentoId =
                            this.formaPagamentoSelecionado.id; // Liga a forma de pagamento

                        this.pedido.situacaoId = this.situacaoSelecionada.id; // Liga a situação do pedido

                        const res = await this.$axios.put(
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
                        this.pedido = null; // Limpa o objeto
                        this.clienteSelecionado = null; // Limpa o objeto
                        this.formaPagamentoSelecionado = null; // Limpa o objeto
                        this.situacaoSelecionada = null; // Limpa o objeto
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
                        this.pedido.clienteId = this.clienteSelecionado.id; // Liga a cidade

                        this.pedido.formaPagamentoId =
                            this.formaPagamentoSelecionado.id; // Liga a forma de pagamento

                        this.pedido.situacaoId = this.situacaoSelecionada.id; // Liga a situação do pedido

                        await this.$axios.post(this.url, this.pedido);

                        this.getPedidos(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `pedido ${this.pedido.numero} Cadastrado com sucesso!`,
                            life: 3000,
                        });

                        this.pedidoDialog = false; // Fecha o pop up
                        this.pedido = null; // Limpa o objeto
                        this.clienteSelecionado = null; // Limpa o objeto
                        this.formaPagamentoSelecionado = null; // Limpa o objeto
                        this.situacaoSelecionada = null; // Limpa o objeto
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
        },
        async deletePedido() {
            try {
                const response = await this.$axios.delete(
                    `${this.url}${this.pedido.id}`
                );

                this.getPedidos();

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

                const response = await this.$axios.delete(this.url, {
                    data: pedidosIds,
                });

                this.getPedidos();

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
            this.formaPagamentoSelecionado = pedido.formaPagamento;
            this.situacaoSelecionada = pedido.situacao;
            this.pedido.ativo = pedido.ativo ? "1" : "0";

            this.pedidoDialog = true;
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
        procurarFormaPagamento(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.formasPagamentosFiltrados = this.formasPagamentos;
                } else {
                    this.formasPagamentosFiltrados =
                        this.formasPagamentos.filter((formaPagamento) => {
                            return formaPagamento.nome
                                .toLowerCase()
                                .startsWith(event.query.toLowerCase());
                        });
                }
            }, 250);
        },
        procurarSituacao(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.situacoesFiltradas = this.situacoes;
                } else {
                    this.situacoesFiltradas = this.situacoes.filter(
                        (situacao) => {
                            return situacao.nome
                                .toLowerCase()
                                .startsWith(event.query.toLowerCase());
                        }
                    );
                }
            }, 250);
        },
        async getClientes() {
            try {
                const response = await this.$axios.get("/cliente");
                this.clientes = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async getFormasPagamentos() {
            try {
                const response = await this.$axios.get("/formaPagamento");
                this.formasPagamentos = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async getSituacoes() {
            try {
                const response = await this.$axios.get("/situacao");
                this.situacoes = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        ultimoPedido() {
            const numeros = this.pedidos.map((p) => parseInt(p.numero));
            return numeros.length > 0 ? Math.max(...numeros) : 0;
        },
        isValid() {
            return (
                this.clienteSelecionado &&
                this.formaPagamentoSelecionado &&
                this.situacaoSelecionada &&
                this.pedido.numero > 0 &&
                this.pedido.valorTotal != null
            );
        },
        addItem() {
            var aux = { ...this.itemNovo };
            this.itensPedido.push(aux);
            this.itemNovo.qtd = null;
            this.itemNovo.produto = null;
        },
    },
    mounted() {
        this.loading = true;
        this.getPedidos();
        this.getClientes();
        this.getFormasPagamentos();
        this.getSituacoes();
    },
    watch: {
        filtro() {
            this.getPedidos();
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