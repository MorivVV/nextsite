<template>
  <div class="row">
    <router-link :to="'/forum/' + topic.id + '/view'"><div class="col s8"> {{topic.theme}} </div></router-link>
    <div class="col s1">{{topic.id}}</div>
    <div class="col s2">{{topic.timestamp}}</div>
    <div class="col s1">{{userInfo.USER_NAME}}</div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  props:{
    topic: Object
  },
  computed:{
    ...mapGetters('forum',['userList']),
    userInfo(){
      if (this.userList.length === 0){
        return {USER_NAME: ""}
      }
      let uid = this.topic.kod_user
      return this.userList.filter(e=>+e.ID === +uid)[0].USER_NAME
    }
  },
  methods:{
    ...mapActions(['fetchData'])
  },
  mounted(){
    // let id = this.topic.ID
    // this.fetchData({data: { sqlname: "getCountPost", kod_theme: id  },stateName: "forum/forums/" + id + "/COUNT"})
  }
}
</script>

<style scoped>
.row {
  margin-bottom: 0;
}
</style>