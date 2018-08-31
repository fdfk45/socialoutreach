<template>
    <v-app>
        <v-container>
          <v-snackbar top v-model="snackbar" error>
      {{signUpErrorMessage}}
      <v-btn flat  @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
           <v-layout justify-center class="signup-layout">
        <v-flex xs12 sm9 md6 lg4 xl4>
            <v-card class="signup-card" @keyup="signUpCardKeyUp">
                <h3 class="signup-header">Sign Up</h3>
                <v-card-text>      
                <v-text-field v-model="email" label="E-mail" class="signup-email" prepend-icon="email" type="email" :error-messages="signupEmailError"></v-text-field>
                
                <v-text-field prepend-icon="vpn_key" class="signup-password" label="Enter your password" v-model="password" :append-icon="isPasswordShown ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (isPasswordShown = !isPasswordShown)" :type="isPasswordShown ? 'password' : 'text'"></v-text-field>
                
                <v-btn primary @click="signup" class="signupBtn" :disabled="isSignupBtnDisabled">Sign Up</v-btn>
                
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn primary to="/login">Log In</v-btn>
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
            title: "SocialOutreach - Sign Up"
        },
        middleware:"auth",
        data() {
            return {
                isPasswordShown: true,
                email: "",
                password: "",
                signupEmailError: [],
                isSignupBtnDisabled: true,
                snackbar: false,
                signUpErrorMessage: ""
            }
        },
        methods: {
            signup() {
                let $this = this;

                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) === false) {
                    this.signupEmailError.push("Email address is invalid")
                } else {
                    this.isSignupBtnDisabled = true;
                    axios.post('/register', {
                            email: this.email,
                            password: this.password
                        }).then(function(response) {
                            if (response.data.success === true) {
                                location.href = "/search"
                            } else {
                                console.log("Error here");
                                $this.isSignupBtnDisabled = false;
                                $this.signUpErrorMessage = response.data.message;
                                $this.snackbar = true;
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                            $this.isSignupBtnDisabled = false;
                            $this.signUpErrorMessage = "Something went wrong, please try again";
                        })
                }
            },
            signUpCardKeyUp() {
                if (this.signupEmailError.length === 1 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) === true) {
                    this.signupEmailError = [];
                } else if (this.email !== "" && this.password !== "") {
                    this.isSignupBtnDisabled = false;
                } else {
                    this.isSignupBtnDisabled = true;
                }
            }
        }

    }

</script>


<style>
    .signup-email,
    .signup-password,
    .signup-fullName {
        margin-bottom: 10px;
    }
    
    .signup-fullName {
        margin-top: 30px;
    }
    
    .signup-header {
        text-align: center;
        box-shadow: 0 1px 4px grey;
        padding: 15px;
    }
    
    .signup-card {
        border-radius: 0;
    }
    
    .signup-layout {
        margin-top: 50px;
    }
    
    .signupBtn {
        margin-left: 30%;
        padding-left: 30px;
        padding-right: 30px;
    }

</style>
