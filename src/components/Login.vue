<template>
 <div class="container">
   <form class="card" @submit.prevent="authorize">
    <h4 class="center">Авторизируйтесь</h4>
    <div class="row">
      <div class="input-field col s12">
        <input id="last_name" required v-model="login" type="text"  class="validate">
        <label for="last_name">Логин</label>
      </div>
    </div>
    <div class="row">
      <div class="input-field col s12">
        <input id="password" required v-model="password" type="password" class="validate">
        <label for="password">Пароль</label>
      </div>
    </div>
    <div class="row center">
     <button class="btn" type="submit">Авторизация</button>
     <hr>
    </div>
   </form>
 </div>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    data(){
      return {
        login : "",
        password : ""
      }
    },
    methods: {
      ...mapActions(['authorizate']),
      authorize: function () {
        let login = this.login 
        let password = this.password
        this.authorizate({ login, password })
       .then(() => {
         this.$M.toast({html: 'Авторизация прошла успешно!'})
         this.$router.push('/users')
         })
       .catch(err => {
         console.log(err)
         this.$M.toast({html: 'Авторизация не удалась'})
         })
      }
    }
  }
</script>