<template>
    <div class="flex items-center justify-center h-screen">
<base-dialog :show="!!error" title="An error occurred" @close="closeErrorDialog">
<p>{{error}}</p>
</base-dialog>
        <base-dialog :show="isLoading" title="Authencating..." fixed>
    <base-spinner></base-spinner>
    </base-dialog>
        <base-card>
            <form @submit.prevent="sunmitForm">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input v-model.trim="email"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="Enter your email">
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input v-model.trim="password"
                        class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="********">
                </div>
                <p class="text-red-500" v-if="!formIdValid">Invalid inputs</p>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        {{ submitButtonCation }}
                    </button>
                    <button
                        class=" hover:text-red-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" @click="switchAuthMode">
                        {{ switchModeButtonCaption }} Instead
                    </button>
                </div>
            </form>
        </base-card>
    </div>
</template>
<script>
export default {
    name: 'UserAuth',
    data() {
        return {
            email: '',
            password: '',
            formIdValid: true,
            mode: 'login',
            isLoading: false,
            error: null
        }
    },
    methods: {
        async sunmitForm() { 
            this.formIdValid = true
            if (this.email === '' || !this.email.includes('@') || this.password.length < 6) {
                this.formIdValid = false
                return; 
            }
            this.isLoading=true;
            try{
                if (this.mode === 'login') {
                    await this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password
                })
            } else {
               await this.$store.dispatch('signup', {
                    email: this.email,
                    password: this.password
                })
            }
            const redirectUrl = '/'+(this.$route.query.redirect || 'coaches')
            this.$router.replace(redirectUrl)
            }catch(error){
                this.error= error.message || 'Failed to authenticate please try again later';
            }
            this.isLoading=false;

        },
        switchAuthMode() {
            if (this.mode == 'login') {
                this.mode = "SignUp"
            } else {
                this.mode = "login"
            }

        },
        closeErrorDialog(){
            this.error=null;
        }

    },
    computed: {
        submitButtonCation() {
            if (this.mode == 'login') {
                return 'Login'
            } else {
                return 'SignUp'
            }
        },
        switchModeButtonCaption() {
            if (this.mode == 'login') {
                return 'SignUp'
            } else {
                return 'Login'
            }
        }
    }

}
</script>
<style></style>