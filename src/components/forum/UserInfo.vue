<template>
  <router-link class="user" :to="'/profile/' + userId" :style="'color:' + user.color" :title="user.rank">
  <slot></slot>
  {{user.name}}
  </router-link>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    userId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState("forum",["users", "ranks"]),
    user(){
      let u = {
        name: "Неизвестный",
        rank: "Гость",
        color: "gray"
      }
      if (this.users.length > 0 && this.ranks.length > 0){
        let fu = this.users.filter(e=>+e.ID === this.userId)
        if (fu.length){
          u.name = fu[0].USER_NAME
          let kod_rank = +fu[0].KOD_RANK
          let r = this.ranks.filter(e=>+e.ID_RANK === kod_rank)
          if (r.length){
            u.rank = r[0].RANK
            u.color = r[0].color
          }
        }
      }
      return u
    }
  }
}
</script>

<style scoped>
.user{
  border-radius: 20px;
  border: solid 1px gray;
  padding: 1px 5px;
}
</style>