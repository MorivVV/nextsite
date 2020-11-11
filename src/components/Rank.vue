<template>
  <div :class="curRank.COLOR + '-text'">
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
    ...mapGetters(['rankList']),
    curRank(){
      if (this.rankList.length === 0){
        return {RANK: ''}
      }
      return this.rankList[this.rank]
    }
  }
}
</script>