<template>
  <TituloPagina titulo="Dashboard"></TituloPagina>
  <div class="container-fluid">
    <div class="row">
      <div class="col-6 chart">
        <p>Grafico aqui</p>
      </div>

    </div>
  </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";
import { baseApiUrl } from "@/global";

const axios = require("axios");

export default {
  name: "Default",
  components: { TituloPagina },
  data() {
    return {
      url: `${baseApiUrl}/bairro/`,
      bairros: [],
      nomesBairros: []
    }
  },
  methods: {
    async getBairros() {
      try {
        const response = await axios.get(this.url);
        this.bairros = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    getNames() {
      let aux = this.bairros.map((v) => {
        return v.nome;
      });          
    }
  },
  async mounted() {
    await this.getBairros();
    await this.getNames();
  }
};
</script>

<style scoped>
.chart {
  background-color: #f4f4f9;
  border-radius: 10px;
}
</style>