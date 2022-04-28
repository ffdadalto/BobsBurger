<template>
  <TituloPagina titulo="Pagina Pedido"></TituloPagina>
  <div class="container-fluid">
  </div>
</template>

<script>
import TituloPagina from "@/components/TituloPagina.vue";

export default {
  name: "Pedido",
  components: { TituloPagina }
}
</script>

<style scoped>
.editar {
  color: white;
  background: #ffc107;
  border: #ffc107;
}

td>button.editar:hover {
  background: #e0a100;
  border: #e0a100;
}

.excluir {
  color: white;
  background: #dc3545;
  border: #dc3545;
}

td>button.excluir:hover {
  background: #ad2626;
  border: #ad2626;
}
</style>