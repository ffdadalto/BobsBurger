<template>
    <div class="rodape">
        <h1>Bob's Burgers © 2022</h1>
        <Divider layout="vertical" align="center"> </Divider>
        <div class="info-empresa">
            <p id="titulo"><b>Bob's Burger SA</b></p>
            <p><i class="pi pi-map-marker"></i>Avenida Central, 1500</p>
            <p><i class="pi pi-map"></i>Laranjeiras, Serra, ES - 29.162-000</p>
            <p><i class="pi pi-phone"></i>Telefone: (27) 3218-3111</p>
            <p>
                <i class="pi pi-clock"></i>Horario de Atendimento: 18:00 às
                00:00
            </p>
        </div>
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
    padding: 30px;
}

.rodape > h1 {
    margin: 0;
}

/* Barra vertical do rodapé */
.p-divider-vertical {
    border: 1px solid white;
    margin: 0 50px;
}

.info-empresa > p {
    margin-bottom: 3px;
    padding: 0;
    font-size: 12px;    
}
.info-empresa > #titulo {
    margin-bottom: 10px;
    font-weight: 400;
    font-size: 18px;  
}

.info-empresa > p > i {
    margin-right: 10px;    
}
</style>
