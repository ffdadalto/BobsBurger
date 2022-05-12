<template>
    <div class="body-login">
        <div class="box-login">
            <div class="box-logo">
                <img src="../assets/logo.png" />
            </div>
            <div class="box-form">
                <div class="formgrid grid">
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
                        <small class="esqueceu-senha" @click="recuperarSenha"
                            >Esqueceu sua senha?</small
                        >
                    </div>
                    <div class="field col-12">
                        <Button label="Entrar" @click="entrar" />
                    </div>
                </div>
            </div>
            <Divider align="center"> </Divider>
            <div class="box-registro">
                <p>
                    Ainda não tem uma conta?
                    <span class="cadastro-link" @click="cadastrar"
                        >Cadastre-se</span
                    >
                </p>
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
            alert("Cadastre-se!");
        },
        entrar() {
            this.submitted = true;
            if (this.validaCampos()) {
                this.$router.push({ name: "home" });
            }
        },

        recuperarSenha() {
            alert("Esqueceu sua Senha!");
        },
        validaCampos() {
            return this.usuario.login && this.usuario.senha;
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

.cadastro-link {
    color: #23343ccb;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
}

.cadastro-link:hover {
    color: #23343c;
}

label {
    display: block;
    width: 100%;
    font-weight: 600;
}

.esqueceu-senha {
    color: rgba(255, 0, 0, 0.795);
    display: block;
    font-size: 12px;
    font-weight: 600px;
    cursor: pointer;
    font-weight: 600;
}

.esqueceu-senha:hover {
    color: rgb(255, 0, 0);
}
</style>
