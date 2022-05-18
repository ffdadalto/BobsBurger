<template>
    <div class="body-login">
        <div class="box-login">
            <div class="box-logo">
                <img src="../assets/logo.png" />
            </div>
            <div class="box-form">
                <div class="formgrid grid">
                    <div class="field col-12">
                        <label>Nome</label>
                        <InputText
                            v-model.trim="usuario.nome"
                            required="true"
                            autofocus
                            :class="{
                                'p-invalid': submitted && !usuario.nome,
                            }"
                        />
                        <small class="p-error" v-if="submitted && !usuario.nome"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <label>E-Mail</label>
                        <InputText
                            v-model.trim="usuario.email"
                            required="true"
                            autofocus
                            :class="{
                                'p-invalid': submitted && !usuario.email,
                            }"
                        />
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.email"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <label>Login</label>
                        <InputText
                            v-model.trim="usuario.login"
                            required="true"
                            autofocus
                            :class="{
                                'p-invalid': submitted && !usuario.login,
                            }"
                        />
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.login"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <label>Senha</label>
                        <Password
                            v-model.trim="usuario.senha"
                            toggleMask
                            :class="{
                                'p-invalid': submitted && !usuario.senha,
                            }"
                        />
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.senha"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12 botoes">
                        <Button
                            class="p-button-raised p-button-warning"
                            label="Voltar"
                            icon="pi pi-chevron-left"
                            @click="this.$router.push({ name: 'login' })"
                        />
                        <Button
                            class="p-button-raised p-button-success"
                            label="Cadastrar"
                            icon="pi pi-check"
                            @click="cadastrar"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    components: {},
    data() {
        return {
            usuario: {},
            submitted: false,
        };
    },
    methods: {
        cadastrar() {
            this.submitted = true;
            if (this.validaCampos()) {
            }
        },
        validaCampos() {
            return (
                this.usuario.nome &&
                this.usuario.login &&
                this.usuario.senha &&
                this.usuario.email
            );
        },
    },
    mounted() {},
};
</script>
<style scoped>
.body-login {
    background: linear-gradient(
        to right,
        var(--cor-menu-pri),
        var(--cor-menu-sec)
    );
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.box-login {
    /* height: 500px; */
    width: 500px;
    background-color: var(--cor-content);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 5px;
}

.box-logo {
    display: flex;
    justify-content: center;
    background-color: var(--cor-header);
    border-bottom: 3px solid #fa2019;
    padding: 20px 50px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.box-form {
    padding: 40px 100px 0px 100px;
}

.p-inputtext {
    display: block;
    width: 100%;
}

.p-divider-horizontal {
    border: 1px solid #2f4550;
}

.box-registro {
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
}

label {
    display: block;
    width: 100%;
    font-weight: 600;
}

button[type="button"] {
    margin-right: 20px;
}

.p-button-warning {
    color: white !important;
}

.botoes {
    margin-top: 20px;
    margin-bottom: 25px;
}
</style>
