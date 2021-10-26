<template>
  <div>
    <new-message @sendMessage="sendMessage" />
    <template v-for="(c, i) in inchats" >
      <div class="row teal lighten-5" :key="'chat_'+c.id">
        <div v-if="i<1 || c.time_send.substr(0,10) !== inchats[i-1].time_send.substr(0,10)" class="col s12 white center">{{c.time_send.substr(0,10)}}</div>
        <label class="col">{{c.time_send.substr(11)}}</label>
        <user-info class="col" :userId="+c.kod_user_from" />
        <user-info class="col right" :userId="+c.kod_user_to" />
        <parsed-post class="col s12 lime lighten-5" :post="c.message" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ParsedPost from '../ParsedPost.vue'
import UserInfo from '../UserInfo.vue'
import NewMessage from './NewMessage.vue'
export default {
  components: { UserInfo, ParsedPost, NewMessage },
  data(){
    return {
      interval: {}
    }
  },
  computed: {
    ...mapState("forum", ["outchats", "inchats"]),
    ...mapGetters(["token"]),
  },
  methods: {
    ...mapActions(["fetchData"]),
    sendMessage(){
      this.getData()
    },
    getUsers(){
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "b32_18009385_users.bd_users",
          fields: [
            "ID",
            "USER_NAME",
            "KOD_RANK",
            "FAMILY",
            "NAME",
            "image"
          ],
          sort: ["id"],
        },
        stateName: "forum/users",
      });
    },
    getRanks(){
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "b32_18009385_users.bd_rank",
          fields: [
            "ID_RANK",
            "RANK",
            "color"
          ]
        },
        stateName: "forum/ranks",
      });
    },
    getData() {
      let kod_user = this.$route.params.id;
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "b32_18009385_users.bd_private_message",
          fields: [ ],
          filter: [
            { 
              kod_user_from	:kod_user,
              kod_user_to	: {
                fields: ["id"],
                from: "bd_users",
                filter: {SESSEION_HASH: this.token}
              } 
            },
            { 
              kod_user_to	:kod_user,
              kod_user_from	: {
              fields: ["id"],
              from: "bd_users",
              filter: {SESSEION_HASH: this.token}
              } 
            }
          ],
          sort: ["-id"],
          limit: 50
        }, 
        stateName: 'forum/inchats'
      });           
    },
  },
  mounted(){
    this.interval = setInterval(() => {
      this.getData()
    }, 10000);
    this.getRanks()
    this.getUsers()
    this.getData()
  },
  destroyed(){
    clearInterval(this.interval)
  }
}
</script>