<template>
    <TituloPagina titulo="Lista de Itens"></TituloPagina>
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
                    :disabled="!selectedItens || !selectedItens.length"
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
            :value="itens"
            responsiveLayout="scroll"
            v-model:selection="selectedItens"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} itens"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true">
                <template #body="{ data }">
                    <img :class="'foto-' + data.id" width="55" />
                    <span class="image-text">{{ data.nome }}</span>
                </template></Column
            >
            <Column field="valor" header="Valor"></Column>
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
                        @click="editItem(slotProps.data)"
                        v-tooltip.top="'Editar'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeleteItem(slotProps.data)"
                        v-tooltip.top="'Excluir'"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="itemDialog"
            :style="{ width: '550px' }"
            header="Cadastro de itens"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label>Nome do Item</label>
                    <InputText
                        id="nome"
                        v-model.trim="item.nome"
                        required="true"
                        autofocus
                        :class="{ 'p-invalid': submitted && !item.nome }"
                    />
                    <small class="p-error" v-if="submitted && !item.nome"
                        >Nome é obrigatório.</small
                    >
                </div>
                <div class="field col-6">
                    <label>Valor do Item</label>
                    <InputText
                        id="nome"
                        v-model.trim.number="item.valor"
                        required="true"
                        autofocus
                        :class="{ 'p-invalid': submitted && !item.valor }"
                    />
                    <small class="p-error" v-if="submitted && !item.valor"
                        >Valor é obrigatório.</small
                    >
                </div>
                <div class="field col-6">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="item.ativo"
                        />
                        <label>Ativo</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="item.ativo"
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
                    @click="salvarItem"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de uma unica item selecionado -->
        <Dialog
            v-model:visible="deleteItemDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="item"
                    >Você tem certeza que deseja apagar o item
                    <b>{{ item.nome }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteItemDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteItem"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varios itens selecionadas -->
        <Dialog
            v-model:visible="deleteItensDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="item"
                    >Você tem certeza que deseja apagar os itens
                    selecionados?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteItensDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedItens"
                />
            </template>
        </Dialog>

        <Toast position="top-center" />
    </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";

export default {
    name: "Item",
    components: { TituloPagina },
    data() {
        return {
            itens: [],
            loading: false,
            item: {},
            submitted: false,
            itemDialog: false,
            deleteItensDialog: false,
            deleteItemDialog: false,
            selectedItens: null,
            url: '/item/',
            filtro: "todos",
        };
    },
    methods: {
        abrirNovo() {
            this.item = {};
            this.item.ativo = "1";
            this.submitted = false;
            this.itemDialog = true;
        },
        async getItens() {
            switch (this.filtro) {
                case "todos":
                    try {
                        const response = await this.$axios.get(this.url);
                        this.itens = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "ativos":
                    try {
                        const response = await this.$axios.get(`${this.url}ativo`);
                        this.itens = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                case "inativos":
                    try {
                        const response = await this.$axios.get(`${this.url}inativo`);
                        this.itens = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                default:
                    try {
                        const response = await this.$axios.get(this.url);
                        this.itens = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um item selecionado, abre o pop up de deleção de um unico item
            if (this.selectedItens.length == 1) {
                this.item = this.selectedItens.shift();
                this.deleteItemDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de delação de varios itens
            else this.deleteItensDialog = true;
        },
        hideDialog() {
            this.itemDialog = false;
            this.submitted = false;
        },
        async salvarItem() {
            this.submitted = true;
            if (this.item.nome.trim()) {
                if (this.item.id) {
                    // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                    try {
                        await this.$axios.put(
                            `${this.url}${this.item.id}`,
                            this.item
                        );

                        this.getItens(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Item ${this.item.nome} atualizado com sucesso`,
                            life: 3000,
                        });

                        this.itemDialog = false; // Fecha o pop up
                        this.item = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro",
                            detail: `Não foi possível atualizar o item ${this.item.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                } else {
                    // Cadastro
                    try {
                        const response = await this.$axios.post(this.url, this.item);

                        this.getItens(); // Refresh na lista

                        this.$toast.add({
                            severity: "success",
                            summary: "Sucesso",
                            detail: `Item ${this.item.nome} Cadastrado com sucesso`,
                            life: 3000,
                        });

                        this.itemDialog = false; // Fecha o pop up
                        this.item = {}; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                    } catch (error) {
                        console.error(error);
                        this.$toast.add({
                            severity: "error",
                            summary: "Erro no cadastro",
                            detail: `Não foi possível cadastrar o item ${this.item.nome}. Erro: ${error}`,
                            life: 3000,
                        });
                    } finally {
                        this.loading = false;
                    }
                }
            }
        },
        async deleteItem() {
            try {
                const response = await this.$axios.delete(
                    `${this.url}${this.item.id}`
                );

                this.getItens(); // Refresh na lista

                this.deleteItemDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Item ${this.item.nome} excluído do sistema`,
                    life: 3000,
                });
                this.item = {};
                this.selectedItens = null;
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar o item ${this.item.nome}. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteItem(item) {
            this.item = item;
            this.deleteItemDialog = true;
        },
        // Metodo para deletar varios itens
        async deleteSelectedItens() {
            try {
                let itensIds = [];
                this.selectedItens.forEach((e) => {
                    itensIds.push(e.id);
                });

                const response = await this.$axios.delete(this.url, {
                    data: itensIds,
                });

                this.getItens(); // Refresh na lista

                this.deleteItensDialog = false;
                this.selectedItens = null;
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
                    detail: `Não foi possível excluir os itens selecionados. Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        editItem(item) {
            this.item = item;
            this.item.ativo = item.ativo ? "1" : "0";

            this.itemDialog = true;
        },
    },
    mounted() {
        this.loading = true;
        this.getItens();
    },
    watch: {
        filtro() {
            this.getItens();
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

.foto-1 {
    content: url("../assets/Hamburger.png");
}

.foto-2 {
    content: url("../assets/X-Burger.png");
}

.foto-9, .foto-10 {
    content: url("../assets/Batatas-Fritas.png");
}

.foto-5{
    content: url("../assets/X-Bacon.png");    
}

.foto-6{
    content: url("../assets/X-EggBacon.png");    
}

.foto-7{
    content: url("../assets/X-Tudo.png");    
}

.foto-3{
    content: url("../assets/Double-X-Burger.png");    
}

.foto-8{
    content: url("../assets/X-Mendingo.png");    
}

.foto-4{
    content: url("../assets/X-Egg.png");    
}

.foto-16, .foto-17 {
    content: url("../assets/Agua-Mineral.png");    
}

.foto-13{
    content: url("../assets/Sundae-Morango.png");    
}

.foto-14{
    content: url("../assets/Sundae-Chocolate.png");    
}

.foto-15{
    content: url("../assets/Sundae-Caramelo.png");    
}

.foto-11, .foto-12{
    content: url("../assets/Mistro-Triplo.png");    
}
</style>