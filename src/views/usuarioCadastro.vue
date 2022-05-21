<template>
    <div class="body-login">
        <div class="box-login">
            <div class="box-logo">
                <img src="../assets/logo.png" />
            </div>
            <div class="box-form">
                <div class="formgrid grid">
                    <div class="field col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-user"></i>
                            </span>
                            <InputText
                                v-model.trim="usuario.nome"
                                autofocus
                                placeholder="Nome"
                                :class="{
                                    'p-invalid': submitted && !usuario.nome,
                                }"
                            />
                        </div>
                        <small class="p-error" v-if="submitted && !usuario.nome"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-at"></i>
                            </span>
                            <InputText
                                v-model.trim="usuario.email"
                                placeholder="E-mail"
                                :class="{
                                    'p-invalid': submitted && !usuario.email,
                                }"
                            />
                        </div>
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.email"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-user-plus"></i>
                            </span>
                            <InputText
                                v-model.trim="usuario.login"
                                autofocus
                                placeholder="Login"
                                :class="{
                                    'p-invalid': submitted && !usuario.login,
                                }"
                            />
                        </div>
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.login"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-eye-slash"></i>
                            </span>
                            <Password
                                v-model.trim="usuario.senha"
                                placeholder="Senha"
                                :class="{
                                    'p-invalid': submitted && !usuario.senha,
                                }"
                            ></Password>
                        </div>
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.senha"
                            >Obrigatório.</small
                        >
                    </div>
                    <div class="field col-12">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-eye-slash"></i>
                            </span>
                            <Password
                                v-model.trim="confirmaSenha"
                                placeholder="Confirme a senha"
                                :feedback="false"
                                :class="{
                                    'p-invalid': submitted && !usuario.senha,
                                }"
                            ></Password>
                        </div>
                        <small
                            class="p-error"
                            v-if="submitted && !usuario.senha"
                            >Obrigatório.</small
                        >
                        <small
                            class="p-error"
                            v-if="
                                submitted && !(usuario.senha === confirmaSenha)
                            "
                            >Senhas não conferem.</small
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
        <Toast position="top-center" />
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
            confirmaSenha: "",
            url: "/usuario/",
        };
    },
    methods: {
        async cadastrar() {
            this.submitted = true;
            if (this.validaCampos()) {
                try {
                    this.usuario.ativo = true;
                    await this.$axios.post(this.url, this.usuario);

                    this.$toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Cadastro realizado com sucesso. Voce será redirecionado para a pagina de login em instantes.`,
                        life: 3000,
                    });

                    setTimeout(() => {
                        // Redireciona para pagina de login
                        this.$router.push({ name: "login" });
                    }, "3000");
                } catch (error) {
                    console.error(error);
                    this.$toast.add({
                        severity: "error",
                        summary: "Erro no cadastro",
                        detail: `Não foi possível cadastrar o usuário ${this.usuario.login}! Erro: ${error}`,
                        life: 3000,
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
        validaCampos() {
            return (
                this.usuario.nome &&
                this.usuario.login &&
                this.usuario.senha &&
                this.confirmaSenha &&
                this.usuario.email &&
                this.usuario.senha === this.confirmaSenha
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

.p-error {
    margin-right: 10px;
}
</style>
