<template>
    <TituloPagina titulo="Pagina Sobre"></TituloPagina>
    <div class="container-fluid">
        <p>
            Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss deixa as
            pessoas mais interessantis.Si u mundo tá muito paradis? Toma um mé
            que o mundo vai girarzis!Detraxit consequat et quo num tendi nada.In
            elementis mé pra quem é amistosis quis leo.
        </p>
        <p>
            Suco de cevadiss deixa as pessoas mais interessantis.Vehicula non.
            Ut sed ex eros. Vivamus sit amet nibh non tellus tristique
            interdum.Todo mundo vê os porris que eu tomo, mas ninguém vê os
            tombis que eu levo!Tá deprimidis, eu conheço uma cachacis que pode
            alegrar sua vidis.
        </p>
        <p>
            Manduma pindureta quium dia nois paga.Casamentiss faiz malandris se
            pirulitá.Posuere libero varius. Nullam a nisl ut ante blandit
            hendrerit. Aenean sit amet nisi.Mé faiz elementum girarzis, nisi
            eros vermeio.
        </p>
        <p>
            Interessantiss quisso pudia ce receita de bolis, mais bolis eu num
            gostis.Praesent vel viverra nisi. Mauris aliquet nunc non turpis
            scelerisque, eget.Praesent malesuada urna nisi, quis volutpat erat
            hendrerit non. Nam vulputate dapibus.Casamentiss faiz malandris se
            pirulitá.
        </p>
        <p>
            Si u mundo tá muito paradis? Toma um mé que o mundo vai
            girarzis!Posuere libero varius. Nullam a nisl ut ante blandit
            hendrerit. Aenean sit amet nisi.Suco de cevadiss deixa as pessoas
            mais interessantis.Detraxit consequat et quo num tendi nada.
        </p>
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
};
</script>
<style scoped>
#mussum {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
