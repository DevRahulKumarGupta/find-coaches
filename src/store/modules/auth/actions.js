let timer;
export default{
    async login(context, payLoad){
 return context.dispatch('auth', {
    ...payLoad, mode:'login'
 })
 
    },

   async signup(context, payLoad){
    return context.dispatch('auth', {
        ...payLoad, mode:'signup'
     })
    },

async auth(context, payLoad){
    const mode = payLoad.mode
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAAZHMmOrcW9wz7fsrZy5YupDq_3pMrFvk'
    if(mode == 'signup'){
        url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAAZHMmOrcW9wz7fsrZy5YupDq_3pMrFvk'
    }

    const response = await fetch(
        url, {
        method:'POST',
        body:JSON.stringify({
            email:payLoad.email,
            password:payLoad.password,
            returnSecureToken:true
        })
    }); 
    // console.log(response)
const responseData= await response.json();
if(!response.ok){
console.log(responseData.error.message)
const error = new Error(responseData.error.message || 'Failed to authenticate. ')
console.log(error)
throw error;
}
console.log(responseData)

const expiresIn = +responseData.expiresIn * 1000;
// const expiresIn = 5000;
const expDate= new Date().getTime() + expiresIn

localStorage.setItem('token', responseData.idToken)
localStorage.setItem('userId', responseData.localId)
localStorage.setItem('tokenExpiration', expDate)
timer = setTimeout(() => {
    context.dispatch('autoLogout');
  }, expiresIn);

context.commit('setUser',{
token: responseData.idToken,
userId: responseData.localId,
tokenExpiration: expDate
})
},
tryLogin(context){
    const token= localStorage.getItem('token')
    const userId= localStorage.getItem('userId')
    const tokenExpiration= localStorage.getItem('tokenExpiration')
    const expiresIn = +tokenExpiration - new Date().getTime();
    // console.log(token, userId, tokenExpiration)
    if(expiresIn < 0){
        return;
    }
    timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);
    context.commit('setUser',{
        token: token,
        userId: userId,
        tokenExpiration: tokenExpiration
        })
},

    logout(context){
        clearTimeout(timer)
        localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenExpiration')
        context.commit('setUser',{
            token: null,
            userId: null,
            tokenExpiration: null
         })
    },
    autoLogout(context){
        context.dispatch('logout');
        context.commit('setAutoLogout');
    }
}