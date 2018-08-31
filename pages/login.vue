<template>
<v-app>   
   <v-container>
   <v-snackbar top v-model="snackbar" error>
      {{loginErrorMessage}}
      <v-btn flat  @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-layout justify-center class="login-layout">
        <v-flex xs12 sm9 md6 lg4 xl4>
            <v-card class="login-card" @keyup="loginCardKeyUp">
                <h3 class="login-header">Login</h3>
                <v-card-text>
                    <v-text-field v-model="email" label="E-mail" class="login-email" prepend-icon="email" type="email" :error-messages="loginEmailError"></v-text-field>

                    <v-text-field prepend-icon="vpn_key" class="login-password" label="Enter your password" v-model="password" :append-icon="isPasswordShown ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (isPasswordShown = !isPasswordShown)" :type="isPasswordShown ? 'password' : 'text'"></v-text-field>
                    
                    <v-btn primary @click="login" class="loginBtn" :disabled="isLogInBtnDisabled">Log In</v-btn>
                </v-card-text>
                <v-divider class="mt-5"></v-divider>
                <v-card-actions>
                    <v-btn flat class="light-blue--text">Forgot Password?</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn primary to="/signup">Sign Up</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</v-app>
</template>

<script>
    import axios from '~/plugins/axios';

    export default {
        head: {
            title: "Social Outreach - Login"
        },
        middleware: "auth",
        data() {
            return {
                email: "",
                password: "",
                isPasswordShown: true,
                loginEmailError: [],
                snackbar: false,
                isLogInBtnDisabled: true,
                loginErrorMessage: ""
            }
        },
        methods: {
            login() {
                var $this = this;
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) === false) {
                    this.loginEmailError.push("Email address is invalid, please enter your registered email");
                } else {
                    this.isLogInBtnDisabled = true;
                    axios.post('/signin', {
                            email: this.email,
                            password: this.password
                        }).then(function(response) {
                            if (response.data.success === true) {
                                location.href = "/search"
                            } else {
                                $this.isLogInBtnDisabled = false;
                                $this.loginErrorMessage = response.data.message;
                                $this.snackbar = true;
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                            $this.isLogInBtnDisabled = false;
                            $this.loginErrorMessage = "Something went wrong, please try again";
                        })
                }
            },
            loginCardKeyUp() {
                if (this.loginEmailError.length === 1 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) === true) {
                    this.loginEmailError = [];
                } else if (this.email !== "" && this.password !== "") {
                    this.isLogInBtnDisabled = false;
                } else {
                    this.isLogInBtnDisabled = true;
                }
            }
        }
    }

</script>

<style>
    .login-email,
    .login-password {
        margin-bottom: 10px;
    }
    
    .login-email {
        margin-top: 30px;
    }
    
    .login-header {
        text-align: center;
        box-shadow: 0 1px 4px grey;
        padding: 15px;
    }
    
    .login-card {
        border-radius: 0;
    }
    
    .login-layout {
        margin-top: 70px;
    }
    
    .loginBtn {
        margin-left: 30%;
        padding-left: 30px;
        padding-right: 30px;
    }

</style>
