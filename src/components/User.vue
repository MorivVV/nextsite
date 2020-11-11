<template>
  <div class="row">
    <router-link :to="'/users/' + user.ID">
      <div class="col s8 m6 l2 xl1"> {{user.USER_NAME}} </div>
    </router-link>
    <div class="col s4 m6 l2 xl1">{{user.ID}}</div>
    <div class="col s4 m3 l2 xl1">{{user.FAMILY}}</div>
    <div class="col s4 m3 l2 xl1">{{user.NAME}}</div>
    <div class="col s4 m3 l2 xl1">{{user.SURNAME}}</div>
    <div class="col s4 m3 l2 xl1">
      <Rank :rank="+user.KOD_RANK" />
    </div>
    <div class="col s4 m3 l2">{{user.EMAIL}}</div>
    <div class="col s4 m3 l2 xl1">{{user.IP}}</div>
    <div class="col s4 m3 l2">{{user.ENTER_TIME}}</div>
    <div class="col s4 m3 l2 xl1">{{user.COUNT}}</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Rank from './Rank'
export default {
  components:{
    Rank
  },
  props:{
    user: Object
  },
  computed:{
    
  },
  methods:{
    ...mapActions(['fetchData'])
  },
  mounted(){
    // let id = this.user.ID
    // this.fetchData({data: { sqlname: "getCountPost", kod_user: id  },stateName: "forum/users/" + id + "/COUNT"})
  }
}
</script>

<style scoped>
.row {
  margin-bottom: 0;
}
</style>