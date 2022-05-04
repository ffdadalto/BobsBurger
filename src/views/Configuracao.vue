<template>
  <TituloPagina titulo="Configurações"></TituloPagina>
  <div class="container-fluid">
    <div class="row">     

    </div>
  </div>
</template>


<script>
import TituloPagina from "@/components/TituloPagina.vue";
import { baseApiUrl } from "@/global";

const axios = require("axios");

export default {
  name: "Configuracao",
  components: { TituloPagina },
  data() {
    return {
      url: `${baseApiUrl}/configuracao`,
      configuracao: {}      
    }
  },
  methods: {
    async getConfiguracao() {
      try {
        const response = await axios.get(this.url);
        this.configuracao = response.data;
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    await this.getConfiguracao();    
  }
};
</script>

<style scoped>
.chart {
  background-color: #f4f4f9;
  border-radius: 10px;
}
</style>