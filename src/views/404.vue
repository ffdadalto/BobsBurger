<template>
    <TituloPagina titulo="Error 404"></TituloPagina>
    <div class="container-fluid">
        <div class="flex-centralizado div-icone-erro">
            <i class="pi pi-thumbs-down icone"></i>
        </div>
        <div class="flex-centralizado div-mensagem-erro">
            <h2>URL inválida ou não encontrada!</h2>
        </div>
        <div class="flex-centralizado">
            <Button
                label="Ir para Home"
                class="p-button-secondary"
                @click="voltar"
            />
        </div>
    </div>
</template>

<script>
import TituloPagina from "@/components/TituloPagina.vue";

export default {
    name: "404",
    components: { TituloPagina },
    data() {
        return {};
    },
    methods: {
        voltar() {
            this.$router.push({ name: "home" });
        },
    },
    mounted() {},
};
</script>
<style scoped>
.flex-centralizado {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 100px 0;
}
.icone {
    font-size: 100px;
}
</style>
