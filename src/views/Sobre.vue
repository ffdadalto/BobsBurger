<template>
    <TituloPagina titulo="Pagina Sobre"></TituloPagina>
    <div class="container-fluid">
        <span v-html="sobreEmpresa"></span>
        <div id="mussum">
            <img src="@/assets/mussum.png" />
        </div>
    </div>
</template>

<script>
import TituloPagina from "@/components/TituloPagina.vue";

export default {
    name: "Sobre",
    components: { TituloPagina },
    data() {
        return {
            url: "/configuracao/sobre",
            sobreEmpresa: "",
        };
    },
    methods: {
        async getConfiguracao() {
            try {
                const response = await this.$axios.get(this.url);

                if (response.data.length > 0)
                    this.sobreEmpresa = response.data.shift().sobreEmpresa;
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.getConfiguracao();
    },
};
</script>
<style scoped>
#mussum {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
