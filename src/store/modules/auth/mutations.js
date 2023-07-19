export default{
    setUser(state, payLoad){
        state.token = payLoad.token;
        state.userId= payLoad.userId;
        state.tokenExpiration= payLoad.tokenExpiration;
        state.didAutoLogout=false
    },
    setAutoLogout(state){
        state.didAutoLogout=true
    }
    
}