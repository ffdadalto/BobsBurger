<template>
    <TituloPagina titulo="Lista de Bairros"></TituloPagina>
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
                    :disabled="!selectedBairros || !selectedBairros.length"
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
            :value="bairros"
            responsiveLayout="scroll"
            v-model:selection="selectedBairros"
            dataKey="id"
            class="p-datatable-sm"
            stripedRows
            :loading="loading"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 40]"
            currentPageReportTemplate="Mostrando {first} ao {last} de um total de {totalRecords} bairros"
        >
            <Column
                selectionMode="multiple"
                style="width: 3rem"
                :exportable="false"
            ></Column>
            <Column field="id" header="Id" :sortable="true"></Column>
            <Column field="nome" header="Nome" :sortable="true"></Column>
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
                        @click="editBairro(slotProps.data)"
                        v-tooltip.top="'Editar'"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="p-button-rounded excluir"
                        @click="confirmDeleteBairro(slotProps.data)"
                        v-tooltip.top="'Excluir'"
                    />
                </template>
            </Column>
        </DataTable>

        <Dialog
            v-model:visible="bairroDialog"
            :style="{ width: '550px' }"
            header="Cadastro de bairros"
            :modal="true"
            class="p-fluid"
        >
            <div class="formgrid grid">
                <div class="field col-12">
                    <label>Cidade</label>
                    <AutoComplete
                        v-model="cidadeSelecionada"
                        :suggestions="cidadesFiltradas"
                        @complete="procurarCidade($event)"
                        :dropdown="true"
                        field="nome"
                        forceSelection
                        placeholder="Selecione uma cidade"
                    >
                        <template #item="slotProps">
                            <div>{{ slotProps.item.nome }}</div>
                        </template>
                    </AutoComplete>
                    <small
                        class="p-error"
                        v-if="submitted && !cidadeSelecionada"
                        >Cidade é obrigatório</small
                    >
                </div>
                <div class="field col-12">
                    <label>Nome</label>
                    <InputText
                        id="nome"
                        v-model.trim="bairro.nome"
                        required="true"
                        :class="{ 'p-invalid': submitted && !bairro.nome }"
                    />
                    <small class="p-error" v-if="submitted && !bairro.nome"
                        >Nome é obrigatório.</small
                    >
                </div>
                <div class="field">
                    <label class="mb-3">Situação</label>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="ativo"
                            name="situacao"
                            value="1"
                            v-model="bairro.ativo"
                        />
                        <label>Ativo</label>
                    </div>
                    <div class="field-radiobutton col-4">
                        <RadioButton
                            id="inativo"
                            name="situacao"
                            value="0"
                            v-model="bairro.ativo"
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
                    @click="salvarBairro"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de um unico bairro selecionado -->
        <Dialog
            v-model:visible="deleteBairroDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="bairro"
                    >Você tem certeza que deseja apagar o bairro
                    <b>{{ bairro.nome }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteBairroDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteBairro"
                />
            </template>
        </Dialog>

        <!-- Pop up deleção de varios bairros selecionados -->
        <Dialog
            v-model:visible="deleteBairrosDialog"
            :style="{ width: '450px' }"
            header="Confirmação"
            :modal="true"
        >
            <div class="confirmation-content">
                <i
                    class="pi pi-exclamation-triangle mr-3"
                    style="font-size: 2rem"
                />
                <span v-if="bairro"
                    >Você tem certeza que deseja apagar os bairros
                    selecionados?</span
                >
            </div>
            <template #footer>
                <Button
                    label="Não"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="deleteBairrosDialog = false"
                />
                <Button
                    label="Sim"
                    icon="pi pi-check"
                    class="p-button-text"
                    @click="deleteSelectedBairros"
                />
            </template>
        </Dialog>

        <Toast position="top-center" />
    </div>
</template>

<script>
import TituloPagina from "@/components/TituloPagina.vue";

export default {
    name: "Bairro",
    components: { TituloPagina },
    data() {
        return {
            bairros: [],
            loading: false,
            bairro: {},
            submitted: false,
            bairroDialog: false,
            situacaoSelecionada: null,
            deleteBairrosDialog: false,
            deleteBairroDialog: false,
            selectedBairros: null,
            url: "/bairro/",
            cidadeSelecionada: null,
            cidadesFiltradas: [],
            cidades: [],
            filtro: "todos",
        };
    },
    methods: {
        abrirNovo() {
            this.bairro = {};
            this.bairro.ativo = "1";
            this.submitted = false;
            this.bairroDialog = true;
        },
        async getBairros() {
            switch (this.filtro) {
                case "todos":
                    try {
                        const response = await this.$axios.get(this.url);
                        this.bairros = response.data;
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
                        this.bairros = response.data;
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
                        this.bairros = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
                    break;
                default:
                    try {
                        const response = await this.$axios.get(this.url);
                        this.bairros = response.data;
                    } catch (error) {
                        console.error(error);
                    } finally {
                        this.loading = false;
                    }
            }
        },
        confirmDeleteSelected() {
            // Se tiver somente um bairro selecionado, abre o pop up de deleção de um unico bairro
            if (this.selectedBairros.length == 1) {
                this.bairro = { ...this.selectedBairros[0] };
                this.deleteBairroDialog = true;
            } // Caso tiver mais de um selecionado, abre o pop up de delação de varios bairros
            else this.deleteBairrosDialog = true;
        },
        hideDialog() {
            this.bairroDialog = false;
            this.submitted = false;
        },
        async salvarBairro() {
            this.submitted = true;
            if (this.bairro.nome && this.cidadeSelecionada) {
                // Validação
                if (this.bairro.nome.trim()) {
                    if (this.bairro.id) {
                        // Caso o objeto vier com um id é edição, caso não vier, é cadastro.
                        try {
                            this.bairro.cidadeId = this.cidadeSelecionada.id; // Liga a cidade escolhia ao Bairro

                            const res = await this.$axios.put(
                                `${this.url}${this.bairro.id}`,
                                this.bairro
                            );

                            this.getBairros(); // Refresh na lista

                            this.$toast.add({
                                severity: "success",
                                summary: "Sucesso",
                                detail: `Bairro ${this.bairro.nome} atualizado com sucesso!`,
                                life: 3000,
                            });

                            this.bairroDialog = false; // Fecha o pop up
                            this.bairro = null; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                            this.cidadeSelecionada = null; // Limpa o objeto pra na proxima abertura do pop up
                        } catch (error) {
                            console.error(error);
                            this.$toast.add({
                                severity: "error",
                                summary: "Erro",
                                detail: `Não foi possível atualizar o bairro ${this.bairro.nome}!. Erro: ${error}`,
                                life: 3000,
                            });
                        } finally {
                            this.loading = false;
                        }
                    } else {
                        // Cadastro
                        try {
                            this.bairro.cidadeId = this.cidadeSelecionada.id; // Liga a cidade escolhia ao Bairro

                            const response = await this.$axios.post(
                                this.url,
                                this.bairro
                            );

                            this.$toast.add({
                                severity: "success",
                                summary: "Sucesso",
                                detail: `Bairro ${this.bairro.nome} Cadastrado com sucesso!`,
                                life: 3000,
                            });

                            this.getBairros(); // Refresh na lista

                            this.bairroDialog = false; // Fecha o pop up
                            this.bairro = null; // Limpa o objeto pra na proxima abertura do pop up os campos virem limpos
                            this.cidadeSelecionada = null; // Limpa o objeto pra na proxima abertura do pop up
                        } catch (error) {
                            console.error(error);
                            this.$toast.add({
                                severity: "error",
                                summary: "Erro no cadastro",
                                detail: `Não foi possível cadastrar o bairro ${this.bairro.nome}! Erro: ${error}`,
                                life: 3000,
                            });
                        } finally {
                            this.loading = false;
                        }
                    }
                }
            }
        },
        async deleteBairro() {
            try {
                await this.$axios.delete(`${this.url}${this.bairro.id}`);

                this.getBairros();

                this.deleteBairroDialog = false;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    detail: `Bairro ${this.bairro.nome} excluído do sistema!`,
                    life: 3000,
                });
                this.bairro = {};
                this.selectedBairros = null;
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro no cadastro",
                    detail: `Não foi possível cadastrar o bairro ${this.bairro.nome}! Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        confirmDeleteBairro(bairro) {
            this.bairro = bairro;
            this.deleteBairroDialog = true;
        },
        // Metodo para deletar varios bairros
        async deleteSelectedBairros() {
            try {
                let bairrosIds = [];
                this.selectedBairros.forEach((e) => {
                    bairrosIds.push(e.id);
                });

                const response = await this.$axios.delete(this.url, {
                    data: bairrosIds,
                });

                this.getBairros();

                this.deleteBairrosDialog = false;
                this.selectedBairros = null;
                this.$toast.add({
                    severity: "success",
                    summary: "Sucesso",
                    // detail: "Os bairros selecionados foram excluídos dos sistema",
                    detail: response.data.message, // A mensagem foi definida no controller
                    life: 3000,
                });
            } catch (error) {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: `Não foi possível excluir os bairros selecionados! Erro: ${error}`,
                    life: 3000,
                });
            } finally {
                this.loading = false;
            }
        },
        editBairro(bairro) {
            this.bairro = bairro;
            this.cidadeSelecionada = bairro.cidade;
            this.bairro.ativo = bairro.ativo ? "1" : "0";

            this.bairroDialog = true;
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
                const response = await this.$axios.get("/cidade");
                this.cidades = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.loading = true;
        this.getBairros();
        this.getCidades();
    },
    watch: {
        filtro() {
            this.getBairros();
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