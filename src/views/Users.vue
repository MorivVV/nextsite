<template>
  <div class="collection">
    <div class="collection-header center"><h4>Пользователи</h4></div>
    <div class="collection-item">
      <div class="row">
        <div class="col s8 m6 l2 xl1"> Логин </div>
        <div class="col s4 m6 l2 xl1">ID</div>
        <div class="col s4 m3 l2 xl1">Фамилия</div>
        <div class="col s4 m3 l2 xl1">Имя</div>
        <div class="col s4 m3 l2 xl1">Отчество</div>
        <div class="col s4 m3 l2 xl1">Звание</div>
        <div class="col s4 m3 l2">E-MAIL</div>
        <div class="col s4 m3 l2 xl1">IP</div>
        <div class="col s4 m3 l2">Последняя активность</div>
        <div class="col s4 m3 l2 xl1">Сообщения</div>
      </div>
    </div>
    <div class="collection-item" v-for="u in userList" :key="u.id">
      <User :user='u' />
    </div>
  </div>
</template>

<script>
import User from '@/components/User'
import { mapActions, mapGetters } from "vuex";
export default {
  components:{
    User
  },
  methods: {
    ...mapActions(["fetchData"]),
  },
  computed: {
    ...mapGetters('forum',["userList"]),
  },
  mounted(){
    this.fetchData({url: "api/restGet",data:{fields: [],from: 'bd_users'}, stateName: 'forum/users'})
    this.fetchData({url: "api/restGet",data:{fields: [],from: 'bd_rank'}, stateName: 'forum/ranks'})
  }
};
</script>