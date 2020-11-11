<template>
  <div class="row">
    <router-link :to="'/forum/' + topic.ID"><div class="col s8"> {{topic.THEME}} </div></router-link>
    <div class="col s1">{{topic.COUNT}}</div>
    <div class="col s2">{{topic.TIME_ADD}}</div>
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
    ...mapGetters(['userList']),
    userInfo(){
      if (this.userList.length === 0){
        return {USER_NAME: ""}
      }
      let uid = this.topic.AUTHOR
      return this.userList[uid]
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