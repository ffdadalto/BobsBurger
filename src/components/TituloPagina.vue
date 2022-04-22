<template>
    <h1 class="display-5">{{ titulo }}</h1>
</template>

<script>
export default {
    name: "TituloPagina",
    props: {
        titulo: {
            type: String,
            required: true
        }
    },
};
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
    color: var(--cor-letra-titulo);
}
</style>