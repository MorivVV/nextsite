<template>
  <div :class="curRank.color + '-text'">
    {{curRank.RANK}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props:{
    rank: Number
  },
  computed:{
    ...mapGetters('forum',['rankList']),
    curRank(){
      let rank = {RANK: '', color: ""}
      if (this.rankList.length > 0){
        rank = this.rankList.filter(e=>+e.ID_RANK === +this.rank)[0]
      }
      return rank
    }
  }
}
</script>