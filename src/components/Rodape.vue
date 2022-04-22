<template>
  <div class="rodape">
    <h1>Bob's Burgers © 2022</h1>
  </div>
</template>

<script>
export default {
  name: "Rodape",
  props: {},
};
</script>

<style scoped>
.rodape {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--cor-letra-rodape);
}

.rodape>h1 {  
    margin: 0;
}
</style>
