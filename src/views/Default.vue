<template>
  <TituloPagina titulo="Pagina Home"></TituloPagina>
  <div class="container-fluid">
    <Message severity="success" :life="3000" :sticky="false">This message will hide in 3 seconds.</Message>
    <h1>{{ msg }}</h1>
    <InputText v-model="text"></InputText>
    <Button label="Greet" icon="pi pi-user" v-on:click="greet"></Button>
    <p>{{ text }}</p>
    <Toast position="top-center" />
  </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";


export default {
  name: "Default",
  components: { TituloPagina },
  methods: {
    greet() {
      this.$toast.add({
        severity: "success",
        summary: "Info Message",
        detail: "Message Content",
        life: 2000,
      });
    },
  },
};
</script>

<style>
</style>